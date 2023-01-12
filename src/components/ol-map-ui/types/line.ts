import { buildProps, definePropType } from '../utils/props/index'
import type { ExtractPropTypes, StyleValue } from 'vue'

  /**
   * @member props
   * @property {number[]} [coordinates] 地图坐标
   * @property {string} [color] 颜色
   * @property {number} [width] 线条宽度
   * @property {string} [lineCap]
   * @property {string} [lineJoin]
   * @property {number[]} [lineDash]
   * @property {number} [lineDashOffset]
   * @property {boolean|object} [arrow] 显示箭头
   * @property {boolean} [arrowEach] 每段线都带箭头
   * @property {boolean} [bezier] 显示曲线
   */
export const lineProps = buildProps({
  coordinates: {
    type: definePropType<number[][]>(Array),
    default() {
      return []
    }
  },
  // 箭头配置
  arrow: {
    type: [Boolean, String, Object],
    default: false
  },
  arrowEach: Boolean,
  // 曲线
  bezier: Boolean,
  color: {
    type: String,
    default: '#409eff'
  },
  width: {
    type: Number,
    default: 3
  },
  lineCap: {
    type: String,
    default: 'round',
    validator(val) {
      return ['butt', 'round', 'square'].includes(val)
    }
  },
  lineJoin: {
    type: String,
    default: 'round',
    validator(val) {
      return ['bevel', 'round', 'miter'].includes(val)
    }
  },
  lineDash: {
    type: Array
  },
  lineDashOffset: Number,
  miterLimit: Number,
  zIndex: {
    type: Number,
    default: 0,
  },
  fill: {
    type: String,
    default: 'rgba(255, 255,255, 0.5)'
  },
  stroke: {
    type: Object,
    default() {
      return {
        width: 3,
        color: '#409eff'
      }
    }
  },
  text: {
    type: [Object, String],
    default: null
  },
  styleFunction: Function,
} as const)
export type LineProps = ExtractPropTypes<typeof lineProps>