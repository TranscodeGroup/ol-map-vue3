import { buildProps, definePropType } from '../utils/props/index'
import type { ExtractPropTypes, StyleValue } from 'vue'

  /**
   * 属性参数
   * @member props
   * @property {Number} [zIndex] 显示层级
   * @property {String} [fill] 填充颜色
   * @property {Object} [stroke] 描边 {color,lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width}
   * @property {Object} [text] 文本， {font,maxAngle,offsetX,offsetY,overflow,placement,scale,rotateWithView,rotation,text,textAlign,textBaseline,fill,stroke,backgroundFill,backgroundStroke,padding}
   * @property {Function} [styleFunction] 渲染Style函数，必须返回Style实例
   */
export const circleProps = buildProps({
  center: {
    type: definePropType<number[]>(Array),
    required: true,
  },
  // 设置圆的半径。半径的单位:米
  radius: {
    type: Number,
    default: 0,
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
export type CircleProps = ExtractPropTypes<typeof circleProps>