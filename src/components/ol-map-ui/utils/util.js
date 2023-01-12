/**
 * 工具函数
 * @module $ui/map/utils/util
 */
import * as Sphere from 'ol/sphere'
import * as Extent from 'ol/extent'
import {fromLonLat as toWGS84, toLonLat as toMercator} from 'ol/proj'

/**
 * 从Vue实例提取参数构造参数集合
 * @param vm
 * @param keys
 * @return {null}
 */
export function mergeProps(vm, keys = []) {
  const props = Object.create(null)
  keys.forEach(key => {
    props[key] = vm[key]
  })
  return props
}

/**
 * 阶乘
 * @param num
 * @return {number}
 */
export function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}

/**
 * 生成贝塞尔曲线
 * @param points
 * @param space 必须要大于0
 * @return {Array}
 */
export function createBezierCurvePoints(points = [], space = 0.01) {
  // 大于2个点才能有曲线
  if (points.length <= 2 || space <= 0) return points

  let x = 0
  let y = 0
  // 控制点个数
  const n = points.length - 1
  const line = [];
  for (let t = 0; t < 1; t = t + space) {
    x = 0;
    y = 0;
    for (let i = 0; i <= n; i++) {
      const [x1, y1] = points[i]
      x += (factorial(n) / (factorial(i) * factorial(n - i))) * Math.pow((1 - t), n - i) * Math.pow(t, i) * x1;
      y += (factorial(n) / (factorial(i) * factorial(n - i))) * Math.pow((1 - t), n - i) * Math.pow(t, i) * y1;
    }
    line.push([x, y]);
  }
  line.push(points[points.length - 1])
  return line;
}

/**
 * 创建曲线的点
 * @param {number[]} from 起点
 * @param {number[]} to 终点
 * @param {number} radius 半径
 * @param {number} angle 角度
 * @param {number} space
 * @return {Array}
 */
export function createCurvePoints(from, to, radius = 0, angle = 90, space = 0.01) {
  const [fx, fy] = from
  const [tx, ty] = to
  // 获取圆心坐标
  const ox = (fx + tx) / 2
  const oy = (fy + ty) / 2
  // 线与x轴的夹角
  const dx = (fy - ty) / (fx - tx)
  // 参照直线的夹角
  const r = (angle * Math.PI / 180) + Math.atan(dx)
  // console.log('r', r)
  // 计算得出曲线拐点的坐标
  const x = ox + radius * Math.cos(r)
  const y = oy + radius * Math.sin(r)
  // 得到了线的曲度控制点
  const line = [from, [x, y], to]
  // 生成曲线的路径坐标集合
  return createBezierCurvePoints(line, space)
}

/**
 * 对线条增加间隔点
 * @param {Array[]} coordinates 线条坐标数组，支持曲线
 * @param {number} space 点的间隔距离，经纬度单位，值越小，增加的点越多
 * @return {Array[]}
 */
export function createLinePathPoints(coordinates = [], space = 0.01) {
  const points = []
  for (let i = 0; i < coordinates.length; i++) {
    if (i >= coordinates.length - 1) break
    const [x1, y1] = coordinates[i]
    const [x2, y2] = coordinates[i + 1]
    // 计算线与x轴的角度
    const k = Math.atan2(Math.abs(y1 - y2), Math.abs(x1 - x2))
    // 0 ~ 90 度之间
    const angle = k * (180 / Math.PI)
    points.push([x1, y1])
    // 大于45度用维度计算，小于45度用经度计算
    if (angle > 45) {
      const diff = space * Math.sign(y2 - y1)
      let y = y1 + diff
      while (diff > 0 ? y < y2 : y > y2) {
        const x = (y - y1) * (x2 - x1) / (y2 - y1) + x1
        points.push([x, y])
        y += diff
      }
    } else {
      const diff = space * Math.sign(x2 - x1)
      let x = x1 + diff
      while (diff > 0 ? x < x2 : x > x2) {
        const y = (y2 - y1) / (x2 - x1) * (x - x1) + y1
        points.push([x, y])
        x += diff
      }
    }
    points.push([x2, y2])
  }
  return [...new Set(points)]
}

/**
 * 格式化数字，修复精度问题
 * @param number
 * @return {number}
 */
export function parseDecimal(number) {
  return parseFloat(number.toFixed(12))
}

/**
 * 检测两个经纬度是否相同
 * @param coordinate1
 * @param coordinate2
 * @return {boolean|boolean}
 */
export function coordinateEqual(coordinate1, coordinate2) {
  if (coordinate1 === coordinate2) return true
  const [x1, y1] = coordinate1
  const [x2, y2] = coordinate2
  return parseDecimal(x1) === parseDecimal(x2) && parseDecimal(y1) === parseDecimal(y2)
}

/**
 * 针对ECharts提供的GeoJSON进行解码
 * @param json
 * @return {{features}|*}
 */
export function geoJsonDecode(json) {
  const features = json.features || []
  features.forEach(feature => {
    const geometry = feature.geometry || {}
    const {coordinates, encodeOffsets} = geometry
    // 如果不存在encodeOffsets，不需要进行解码
    if (!encodeOffsets) return
    geometry.coordinates = coordinates.map((coordinate, i) => {
      if (Array.isArray(coordinate)) {
        return coordinate.map((item, j) => {
          return decodePolygon(item, encodeOffsets[i][j])
        })
      } else {
        return decodePolygon(coordinate, encodeOffsets[i])
      }
    })
    // 和已经解码后清除标识
    geometry.encodeOffsets = null
  })
  return json
}


/**
 * 计算两经纬度坐标点距离，
 * @param {Array} coordinate1 标准经纬度坐标数组,如：[113.38585096783513, 22.96213834599851]；
 * @param {Array} coordinate2 标准经纬度坐标数组,如：[113.38585096783513, 22.96213834599851]；
 * @return {Number} 返回距离，单位为米；
 */
export function getDistance(coordinate1, coordinate2) {
  return Sphere.getDistance(coordinate1, coordinate2)
}

/*
 * 计算当前地图 1px 相当于 多少 m 距离
 */
export function getScale(map, mapComp) {
  const mapWidth = mapComp.$el.offsetWidth
  const view = map.getView()
  const extent = view.calculateExtent()
  const bottomLeft = Extent.getBottomLeft(extent)
  const bottomRight = Extent.getBottomRight(extent)
  const distance = Sphere.getDistance(bottomLeft, bottomRight)
  return distance / mapWidth
}

/**
 * Icon 字体转 图片 方法（用于大批量icon在地图中实现）
 * @param {String} fontClass icon 的名称
 * @param {Number} size icon 大小
 * @param {String} color icon 颜色
 * @param {String} fontFamily icon 字体的类型 （IconFont / 'element-icons'）
 * @return {Promise} Promise(img)
 */
export function svgToImg(fontClass, size, color, fontFamily = 'IconFont') {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('CANVAS')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    const span = document.createElement('SPAN')
    span.className = fontClass
    document.body.appendChild(span)
    const content = window.getComputedStyle(span, '::before').content
    setTimeout(() => {
      ctx.fillStyle = color;
      ctx.font = `${size - 2}px ${fontFamily}`;

      ctx.textAlign = 'center'
      ctx.fillText(content, size / 2, size - 4);
      const img = canvas.toDataURL('base64')
      document.body.removeChild(span)
      if (img) {
        resolve(img)
      } else {
        reject(new Error('img fail'))
      }
    }, 200)
  })
}


// 从Echarts提取的编码解码方法
export const decodePolygon = function (coordinate, encodeOffsets) {
  const result = [];
  let prevX = encodeOffsets[0];
  let prevY = encodeOffsets[1];
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    // ZigZag decoding
    x = (x >> 1) ^ (-(x & 1));
    y = (y >> 1) ^ (-(y & 1));
    // Delta deocding
    x += prevX;
    y += prevY;

    prevX = x;
    prevY = y;
    // Dequantize
    result.push([x / 1024, y / 1024]);
  }

  return result;
}


//

/**
 * 墨卡托坐标转换成WGS84坐标，即 EPSG:4326 转换成  EPSG:3857
 * @param {number[]|Array[]} coordinate
 * @returns {Array}
 */
export function fromLonLat(coordinate) {
  if (!Array.isArray(coordinate)) return null
  if (coordinate.length === 0) return []
  return Array.isArray(coordinate[0])
    ? coordinate.map(n => toWGS84(n))
    : toWGS84(coordinate)
}

/**
 * WGS84坐标转换成墨卡托坐标，即 EPSG:3857 转换成  EPSG:4326
 * @param {number[]|Array[]} coordinate
 * @returns {Array}
 */
export function toLonLat(coordinate) {
  if (!Array.isArray(coordinate)) return null
  if (coordinate.length === 0) return []
  return Array.isArray(coordinate[0])
    ? coordinate.map(n => toMercator(n))
    : toMercator(coordinate)
}
