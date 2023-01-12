<script lang="ts">
// 声明额外的选项
export default {
  name: 'OlMapCircle',
}
</script>
<script setup lang="ts">
import Circle from 'ol/geom/Circle'
import Feature from 'ol/Feature';
import { onMounted, onUnmounted, watch, inject } from 'vue';
import { circleProps } from '../types/circle';
import parseStyle from '../utils/style'

const emit = defineEmits(['feature-draw'])

const props = defineProps(circleProps)

// 注入一个值，若为空则使用提供的默认值
const myMap: any = inject('myMap', null)

let feature = $ref<Feature>()

// 单位米转换成投影单位值
const getRadius = () => {
  const metersPerUnit = myMap.getMetersPerUnit()
  return metersPerUnit ? props.radius / metersPerUnit : 0
}

/**
     * 创建图形接口，必须要返回 Geometry 实例
     * @interface
     * @return {Geometry} geometry
     */
const drawHandler = () => {
  return new Circle(props.center, getRadius())
}
/**
 * 修改图形接口，需要实现对图形进行修改设置
 * @interface
 * @param {Geometry} geometry
 */
const modifyHandler = (geometry: Circle) => {
  geometry.setCenter(props.center)
  geometry.setRadius(getRadius())
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
  console.log('this.feature :>> ', feature);
  if (!feature) {
    draw()
    return
  }
  const geometry = feature.getGeometry()
  modifyHandler(geometry as Circle)
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
