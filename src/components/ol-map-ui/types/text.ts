import { buildProps, definePropType } from '../utils/props/index'
import type { ExtractPropTypes, StyleValue } from 'vue'

  /**
   * 属性参数
   * @member props
   * @property {string} [font] 文字样式
   * @property {number} [maxAngle] 偏移角度
   * @property {number} [offsetX] X方向偏移
   * @property {number} [offsetY] Y方向偏移
   * @property {boolean} [overflow]
   * @property {string} [placement] 定位方式 'point' 'line'
   * @property {number} [scale] 放大缩小比例
   * @property {boolean} [rotateWithView] 是否根据地图视口旋转
   * @property {string} [text] 显示文字
   * @property {string} [textAlign] 文字横向对齐
   * @property {string} [textBaseline] 文字对齐基线
   * @property {string} [backgroundFill] 文字背景色
   * @property {string} [backgroundStroke] 文字背景边框
   * @property {number[]} [padding] 文字背景填充距离 默认[0,0,0,0]
   * @property {number[]} [coordinate] 地图坐标
   */
export const textProps = buildProps({
  font: {
    type: String,
    default: '12px'
  },
  maxAngle: Number,
  offsetX: Number,
  offsetY: Number,
  overflow: Boolean,
  placement: {
    type: String,
    default: 'point',
    validator(val) {
      return ['point', 'line'].includes(val)
    }
  },
  scale: Number,
  rotateWithView: Boolean,
  rotation: Number,
  textAlign: String,
  textBaseline: String,
  backgroundFill: String,
  backgroundStroke: Object,
  padding: Array,
  coordinate: {
    type: definePropType<number[]>(Array),
    required: true
  },
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
export type TextProps = ExtractPropTypes<typeof textProps>