<script lang="ts">
// 声明额外的选项
export default {
  name: 'OlMapText',
}
</script>
<script setup lang="ts">
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature';
import { onMounted, onUnmounted, watch, inject } from 'vue';
import { textProps } from '../types/text';
import parseStyle from '../utils/style'

const emit = defineEmits(['feature-draw'])

const props = defineProps(textProps)

// 注入一个值，若为空则使用提供的默认值
const myMap: any = inject('myMap', null)

let feature = $ref<Feature>()

const drawHandler = () => {
  return new Point(props.coordinate)
}
// 重写 setStyle
const setStyle = () => {
  if (!feature) return
  const style = parseStyle({
    text: {
      ...props
    }
  })
  feature.setStyle(style)
}
const modifyHandler = (geometry: Point) => {
  geometry.setCoordinates(props.coordinate)
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

/**
 * 修改图形
 * @method modify
 */
const modify = () => {
  if (!feature) {
    draw()
    return
  }
  const geometry = feature.getGeometry()
  modifyHandler(geometry as Point)
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
