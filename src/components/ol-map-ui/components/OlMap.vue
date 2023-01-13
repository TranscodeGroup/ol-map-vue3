<script lang="ts">
// 声明额外的选项 组件名称
export default {
  name: 'OlMap',
}
</script>
<script setup lang="ts">
/**
 * 地图基础图层组件
 *
 */
import Map from 'ol/Map'
import View from 'ol/View'
import DragPan from 'ol/interaction/DragPan'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import PointerInteraction from 'ol/interaction/Pointer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { createLayer } from '../utils/layer'
import { onMounted, onBeforeUnmount, computed, watch, inject, provide } from 'vue'
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type { Pixel } from 'ol/pixel'
import type { FeatureLike } from 'ol/Feature'
import { mapProps } from '../types/map';

import '../style/map.scss'

const emit = defineEmits(['mouseenter', 'mouseleave', 'ready', 'view-size-change'])


const props = defineProps(mapProps)

let cursor = $ref(null)
let viewWidth = $ref(0)
let viewHeight = $ref(0)
let map = $ref<Map | null>(null)
let featureAtPixel = $ref<FeatureLike>()
let vectorLayer = $ref<VectorLayer<any>>()
const olMap = $ref<HTMLElement | undefined>()

// 注入一个值，若为空则使用提供的默认值
const page = inject('page', null)

const classes = computed(() => ({
  'my-map': true,
  'my-map--invert': props.invert,
}))

const styles = computed(() => ({
  width: props.width,
  height: props.height,
  cursor: cursor ? 'pointer' : '',
}))

const filterStyle = $computed(() => {
  if (!props.filter)
    return ''
  const filters = Object.entries(props.filter).map(([name, value]) => {
    if (name === 'hue-rotate')
      return `${name}(${value}deg)`

    return `${name}(${value})`
  })
  return filters.join(' ')
})

/**
* 设置是否激活交互工具
* @method setActive
* @param {Object} name 工具类
* @param {Boolean} active 是否激活
*/
const setActive = (name: typeof DragPan | typeof MouseWheelZoom, active: boolean) => {
  if (!map)
    return
  const interactions = map.getInteractions().getArray()
  const instance = interactions.find(n => n instanceof name)
  if (instance)
    instance.setActive(active)
}

watch(
  () => props.dragPan,
  (val) => {
    setActive(DragPan, val || false)
  }
)

watch(
  () => props.mouseWheelZoom,
  (val) => {
    setActive(MouseWheelZoom, val || false)
  }
)

const setCanvasFilter = () => {
  if (!map)
    return
  const viewport = map.getViewport()
  if (viewport)
    viewport.style.filter = filterStyle
}

watch(
  () => filterStyle,
  () => {
    setCanvasFilter()
  }
)

const dispose = () => {
  if (!map)
    return

  map.dispose()
}

/**
 * 根据地图上的像素位置获取图形对象
 * @method getFeatureAtPixel
 * @param  {Number[]} pixel 位置像素 [x,y]
 * @return {Feature}
 */
const getFeatureAtPixel = (pixel: Pixel) => {
  if (!map)
    return null
  return map.forEachFeatureAtPixel(pixel, feature => feature)
}

/**
* 获取图形挂载的 Vue实例
* @method getFeatureVM
* @param feature
* @returns {*}
*/
const getFeatureVM = (feature: FeatureLike) => {
  if (!feature)
    return
  const features = feature.get('features') || []
  const matchFeature = features[0] || feature
  return matchFeature.__vm__ || matchFeature.get('__vm__')
}

/**
* 当图形可点击时，设置图形鼠标 cursor pointer
* @method setCursor
* @param {ol/Feature} feature
*/
const setCursor = (feature: FeatureLike) => {
  const vm = getFeatureVM(feature)
  cursor = vm && (vm.cursor || vm.$attrs?.onClick)
}

const enterAndLeaveTrigger = (feature: FeatureLike, e: MouseEvent) => {
  // 无>有：鼠标移入
  if (!featureAtPixel && feature) {
    emit('mouseenter', e, feature)
    const vm = getFeatureVM(feature)
    vm && vm.$emit('mouseenter', e, feature)
  }

  // 有>无： 鼠标移出
  if (featureAtPixel && !feature) {
    emit('mouseleave', e, featureAtPixel)
    const vm = getFeatureVM(featureAtPixel)
    vm && vm.$emit('mouseleave', e, featureAtPixel)
  }
  // 同有，但不等：一出一进
  if (featureAtPixel && feature && featureAtPixel !== feature) {
    emit('mouseleave', e, featureAtPixel)
    emit('mouseenter', e, feature)
    const vmAtPixel = getFeatureVM(featureAtPixel)
    vmAtPixel && vmAtPixel.$emit('mouseleave', e, featureAtPixel)

    const vm = getFeatureVM(feature)
    vm && vm.$emit('mouseenter', e, feature)
  }
  // 更新
  featureAtPixel = feature
}

/**
* 触发图形点击事件
* @method clickTrigger
* @param {ol/Feature} feature
* @param {Object} e
*/
const clickTrigger = (feature: FeatureLike, e: MouseEvent, eventName = 'click') => {
  if (feature) {
    const vm = getFeatureVM(feature)
    if (vm)
      vm.$emit(eventName, e, feature)
  }
}

const handleEvent = (e: MapBrowserEvent<any>) => {
  const type = e.type
  const pageTemp = page as any || {}
  const { widthScale = 1, heightScale = 1 } = pageTemp
  const [x, y] = e.pixel
  const pixel = [x / widthScale, y / heightScale]
  const feature = getFeatureAtPixel(pixel)
  switch (type) {
    case 'pointermove':
      setCursor(feature as FeatureLike)
      enterAndLeaveTrigger(feature as FeatureLike, e as any)
      break
    case 'click':
      clickTrigger(feature as FeatureLike, e as any)
      break
    default:
      clickTrigger(feature as FeatureLike, e as any, type)
      break
  }

  return true
}

const init = () => {
  const { center, projection, zoom, minZoom, maxZoom } = props
  const layer = createLayer(props.adapter)
  // 标识图层
  layer.__MY_LAYER__ = true
  const view = new View({
    ...(props.viewOptions || {}),
    projection,
    center,
    zoom,
    minZoom,
    maxZoom,
  })
  map = new Map({
    ...(props.mapOptions || {}),
    layers: [].concat(layer),
    view,
    target: olMap,
    // 删除默认的控件
    controls: [],
    interactions: [
      new DragPan(),
      new MouseWheelZoom(),
      new PointerInteraction({
        handleEvent: handleEvent,
      }),
    ],
  })
  setActive(DragPan, props.dragPan || false)
  setActive(MouseWheelZoom, props.mouseWheelZoom || false)
  /**
   * 地图初始化完成时触发
   * @event ready
   * @param {Map} map ol/Map实例
   * @param {VueComponent} vm Vue实例
   */
  // emit('ready', map, this)

  setCanvasFilter()
}

/**
* 重置地图尺寸，当容器的尺寸变化后需要执行resize
* @method resize
*/
const resize = () => {
  map?.updateSize()
}

watch(
  () => props.adapter,
  () => {
    dispose()
    init()
  }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  dispose()
})

/**
* 获取瓦片图层实例
* @method getLayer
* @returns {Array}
*/
const getLayer = () => {
  if (!map)
    return null
  return map.getLayers().getArray().find(n => (n as any).__MY_LAYER__)
}

/**
* 移动到指定经纬度居中
* @method moveTo
* @param {Number[]} loc 经纬度数组
*/
const moveTo = (loc: number[]) => {
  if (!map)
    return
  const view = map.getView()
  view.animate(
    {
      center: loc,
      duration: 200,
    })
}


/**
* 设置地图缩放等级
* @method zoomTo
* @param {Number|String} level 等级数值
*/
const zoomTo = (level: number | string | undefined) => {
  if (!map)
    return
  const view = map.getView()
  view.animate(
    {
      zoom: level ? +level : 1,
      duration: 200,
    })
}

/**
* 逐步放大
* @method zoomIn
*/
const zoomIn = () => {
  if (!map)
    return
  const view = map.getView()
  zoomTo(view.getZoom() || 1 + 1)
}

/**
 * 逐步缩小
 * @method zoomOut
 */
const zoomOut = () => {
  if (!map)
    return
  const view = map.getView()
  zoomTo(view.getZoom() || 1 - 1)
}

/**
* 地图初始化完成回调
* @method mapReady
* @param callback
*/
const mapReady = (callback: any) => {
  if (map)
    callback && callback(map, olMap)

  // this.$once('ready', callback)
}

/**
* 创建矢量图层，只会创建一个图层，已创建即复用
*/
const createVectorLayer = () => {
  if (!map || vectorLayer)
    return
  const vectorSource = new VectorSource()
  vectorLayer = new VectorLayer({
    source: vectorSource,
    zIndex: 1,
  })
  map.addLayer(vectorLayer)
  return vectorLayer
}

/**
* 在地图上添加图形, 图形加入到矢量图层
* @method addFeature
* @param {Feature[]|feature} feature
*/
const addFeature = (feature: FeatureLike[] | FeatureLike) => {
  if (!map)
    return
  if (!vectorLayer)
    createVectorLayer()

  const source = vectorLayer?.getSource()
  const features = ([] as FeatureLike[]).concat(feature)
  source.addFeatures(features)
}

/**
 * 删除图形
 * @method removeFeature
 * @param {Feature[]|feature} feature
 */
const removeFeature = (feature: FeatureLike[] | FeatureLike) => {
  if (!vectorLayer)
    return
  const source = vectorLayer.getSource()
  const features = ([] as FeatureLike[]).concat(feature)
  features.forEach(feat => source.removeFeature(feat))
}

/**
* 获取每个投影单位代表的距离米
* @method getMetersPerUnit
* @return {*|number|number}
*/
const getMetersPerUnit = () => {
  if (!map)
    return 0
  const view = map.getView()
  const projection = view.getProjection()
  return projection.getMetersPerUnit()
}

/**
 * 更新视图可视区尺寸
 */
const setViewSize = () => {
  const rect = olMap?.getBoundingClientRect()
  viewWidth = rect?.width || 0
  viewHeight = rect?.height || 0
  if (map)
    map.updateSize()

  emit('view-size-change', rect)
}

/**
* 清空所有覆盖物
*/
const clear = () => {
  if (!map)
    return
  const layers = map
    .getLayers()
    .getArray()
    .filter(n => !(n as any).__MY_LAYER__)

  layers.forEach((n) => {
    (n as any).getSource().clear()
  })

}

const getMap = () => {
  return map
}

provide('myMap', {
  getMap,
  mapReady,
  addFeature,
  removeFeature,
  getMetersPerUnit,
  clear,
})

defineExpose({
  getMap,
  mapReady,
  addFeature,
  removeFeature,
  getMetersPerUnit,
  clear,
})
</script>

<template>
  <div ref="olMap" :class="classes" :style="styles">
    <slot />
  </div>
</template>
