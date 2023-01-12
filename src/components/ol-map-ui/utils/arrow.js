import defaultArrow from '../sources/arrows/arrow.svg'
import parseStyle from './style'
import Point from 'ol/geom/Point'

const defaultSvgSize = 200
const defaultScaleSize = 16

const defaultOptions = {
  src: defaultArrow,
  anchor: [0.75, 0.5],
  rotateWithView: true,
  rotation: 0,
  color: '#409eff',
  scale: 1
}

function getOpacity(color = '') {
  if (color === 'transparent') return 0
  const regex = /\.\d*/
  const matches = color.match(regex)
  if (matches && matches[0]) {
    return parseFloat(matches[0])
  }
  return 1

}


/**
 * 构造箭头样式
 * @param {number[]} start 起点经纬度
 * @param {number[]} end 终点经纬度
 * @param {Object|Boolean|String} opts 箭头Icon配置项
 * @param {Object} [defaultValue] 默认配置项
 * @return {Style}
 */
export default function (start, end, opts = {}, defaultValue = {}) {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const icon = {
    ...defaultOptions,
    ...defaultValue,
    ...(typeof opts === 'string' ? {src: opts} : opts)
  }
  icon.rotation = -Math.atan2(dy, dx)
  icon.scale = defaultScaleSize * icon.scale / defaultSvgSize
  icon.opacity = getOpacity(icon.color)

  return parseStyle({
    geometry: new Point(end),
    icon: icon
  })
}
