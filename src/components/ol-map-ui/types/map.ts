import { buildProps, definePropType } from '../utils/props/index'
import type { ExtractPropTypes } from 'vue'

export const mapProps = buildProps({
  zoom: {
    type: Number,
    default: 10,
  },
  minZoom: {
    type: Number,
    default: 1,
  },
  maxZoom: {
    type: Number,
    default: 20,
  },
  // 初始化中心经纬度
  center: {
    type: definePropType<number[]>(Array),
    default() {
      return [113.261999, 23.130592]
    },
  },
  // 图层适配器, {id,type, url, layers(天地图专用)}
  adapter: {
    type: [String, Object, Function],
    default: 'Baidu',
  },
  // 投影标准
  projection: {
    type: String,
    default: 'EPSG:4326',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '400px',
  },
  // 可拖拽移动图层
  dragPan: {
    type: Boolean,
    default: true,
  },
  // 鼠标滚轮可缩放图层
  mouseWheelZoom: {
    type: Boolean,
    default: true,
  },
  // ol/Map 实例化参数选项
  mapOptions: Object,
  // ol/View 实例化参数选项
  viewOptions: Object,
  // 颜色反相
  invert: Boolean,
  // 滤镜
  filter: Object,
} as const)
export type MapProps = ExtractPropTypes<typeof mapProps>
