/**
 * 样式构造工具函数
 * @module $ui/map/utils/style
 */
import {Circle, Fill, Icon, RegularShape, Stroke, Style, Text} from 'ol/style'


const PROPS_MAP = {
  fill: Fill,
  text: Text,
  stroke: Stroke,
  circle: Circle,
  icon: Icon,
  regularShape: RegularShape,
  backgroundFill: Fill,
  backgroundStroke: Stroke
}

const IMAGE_PROPS = [Circle, Icon, RegularShape]

function isObject(value) {
  return typeof value === 'object'
}

function parseFill(fill) {
  const opts = isObject(fill) ? fill : {color: fill}
  return new Fill(opts)
}


function parseValue(Model, key, value) {
  if (value === undefined || value === null) return
  if (!Model) return value
  if (['fill', 'backgroundFill'].includes(key)) return parseFill(value)
  if (key === 'text') {
    return isObject(value) ? parse(value, Model) : value
  }
  return parse(value, Model)
}


// { text, stroke, circle}
/**
 * 构建样式
 * @param {Object} settings 配置 { text, stroke, circle, fill, icon, image}
 * @param {Object} [StyleModel]
 * @return {Style}
 */
function parse(settings, StyleModel) {
  const opts = {}
  Object.entries(settings).forEach(([key, value]) => {
    const Model = PROPS_MAP[key]
    if (key === 'font') {
      value = `${value} sans-serif`
    }
    opts[IMAGE_PROPS.includes(Model) ? 'image' : key] = parseValue(Model, key, value)
  })
  return new (StyleModel || Style)(opts)
}


export default parse
