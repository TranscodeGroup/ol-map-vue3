<script lang="ts">
// 声明额外的选项
export default {
  name: 'OlMapPolygon',
}
</script>
<script setup lang="ts">
import Polygon from 'ol/geom/Polygon'
import Feature from 'ol/Feature';
import { onMounted, onUnmounted, watch, inject } from 'vue';
import { polygonProps } from '../types/polygon';
import parseStyle from '../utils/style'

const emit = defineEmits(['feature-draw'])

const props = defineProps(polygonProps)

// 注入一个值，若为空则使用提供的默认值
const myMap: any = inject('myMap', null)

let feature = $ref<Feature>()

const drawHandler = () => {
      return new Polygon([props.coordinates])
    }
    const modifyHandler = (geometry: Polygon) => {
      geometry.setCoordinates([props.coordinates])
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
  myMap?.addFeature(feature)
  setStyle()
  emit('feature-draw')
}


const styleText = $computed(() => {
  return typeof props.text === 'string'
    ? { text: props.text, font: '12px' }
    : (props.text || {})
})
/**
 * 设置图形样式
 * @method setStyle
 */
const setStyle = () => {
  if (!feature) return
  const style = props.styleFunction
    ? props.styleFunction(this)
    : parseStyle({
      fill: props.fill,
      stroke: props.stroke,
      zIndex: props.zIndex,
      text: styleText
    })

  feature.setStyle(style)
}
/**
 * 修改图形
 * @method modify
 */
const modify = () => {
  if (!feature) {
    draw()
    return
  }
  const geometry = feature.getGeometry() as Polygon
  modifyHandler(geometry)
  setStyle()
  feature.setProperties({ ...props }) // 绑定属性
}

onMounted(() => {
  setTimeout(() => {
    myMap?.mapReady(draw)
    modify()
  }, 1000)
})

onUnmounted(() => {
  if (feature) {
    // feature.__vm__ = null
    feature.dispose()
    myMap?.removeFeature(feature)
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
