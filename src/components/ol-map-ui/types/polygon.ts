import { buildProps, definePropType } from '../utils/props/index'
import type { ExtractPropTypes } from 'vue'

  /**
   * @member props
   * @property {number[]} [coordinates] 地图坐标
   */
export const polygonProps = buildProps({
  coordinates: {
    type: definePropType<number[][]>(Array),
    default() {
      return []
    }
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
export type PolygonProps = ExtractPropTypes<typeof polygonProps>