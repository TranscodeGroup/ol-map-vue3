<script lang="ts">
// 声明额外的选项
export default {
  name: 'OlMapLine',
}
</script>
<script setup lang="ts">
import LineString from 'ol/geom/LineString'
import Feature from 'ol/Feature';
import { onMounted, onUnmounted, watch, inject } from 'vue';
import { lineProps } from '../types/line';
import parseStyle from '../utils/style'
import createArrow from '../utils/arrow'
import { createBezierCurvePoints } from '../utils/util'

const emit = defineEmits(['feature-draw'])

const props = defineProps(lineProps)

// 注入一个值，若为空则使用提供的默认值
const myMap: any = inject('myMap', null)

let feature = $ref<Feature>()

const lastSegmentStyle = () => {
  const length = props.coordinates.length
  if (length >= 2) {
    const start = props.coordinates[length - 2]
    const end = props.coordinates[length - 1]
    return createArrow(start, end, props.arrow, { color: props.color })
  }
}

const createLineStyle = () => {

  const { fill, zIndex, stroke, styleFunction } = props
  const text = {
    placement: 'line',
    rotateWithView: true,
    ...styleText
  }
  const style = typeof styleFunction === 'function'
    ? styleFunction(this)
    : parseStyle({
      fill,
      stroke,
      zIndex,
      text
    })
  return [style]
}

const setStyle = () => {
  if (!feature) return
  const styles = createLineStyle()
  if (props.arrow) {
    if (props.arrowEach) {
      const geometry = feature.getGeometry() as LineString
      geometry.forEachSegment((start, end) => {
        styles.push(createArrow(start, end, props.arrow))
      })
    } else {
      const lastStyle = lastSegmentStyle()
      styles.push(lastStyle)
    }
  }
  feature.setStyle(styles)
}
const createLine = () => {
  return props.bezier ? createBezierCurvePoints(props.coordinates) : props.coordinates
}
const drawHandler = () => {
  const line = createLine()
  if (line && line.length > 0) {
    return new LineString(line)
  }
  return null

}
const modifyHandler = (geometry: LineString) => {
  const line = createLine()
  geometry.setCoordinates(line)
}

/**
 * 渲染图形
 * @method draw
 */
const draw = () => {
  const geometry = drawHandler()
  if (!geometry) return
  feature = new Feature({ geometry })
  // feature.__vm__ = this
  feature.setProperties({ ...props }) // 绑定属性
  myMap.addFeature(feature)
  setStyle()
  emit('feature-draw')
}


const styleText = $computed(() => {
  return typeof props.text === 'string'
    ? { text: props.text, font: '12px' }
    : (props.text || {})
})

/**
 * 修改图形
 * @method modify
 */
const modify = () => {
  console.log('this.feature :>> ', feature);
  if (!feature) {
    draw()
    return
  }
  const geometry = feature.getGeometry() as LineString
  modifyHandler(geometry)
  setStyle()
  feature.setProperties({ ...props }) // 绑定属性
}

onMounted(() => {
  setTimeout(() => {
    myMap.mapReady(draw)
    modify()
  }, 1000)
})

onUnmounted(() => {
  if (feature) {
    // feature.__vm__ = null
    feature.dispose()
    myMap.removeFeature(feature)
  }
});

watch(
  () => props,
  () => {
    modify()
  },
  {
    deep: true
  }
)

</script>
