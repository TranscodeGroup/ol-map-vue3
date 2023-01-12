import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileGrid from 'ol/tilegrid/TileGrid'
import { Projection, addCoordinateTransforms, addProjection } from 'ol/proj'
import projzh from 'projzh'

const bd09Extent = [-20037726.37, -12474104.17, 20037726.37, 12474104.17]
const baiduMercator = new Projection({
  code: 'baidu',
  extent: bd09Extent,
  units: 'm',
})
addProjection(baiduMercator)
addCoordinateTransforms('EPSG:4326', baiduMercator, projzh.ll2bmerc, projzh.bmerc2ll)
addCoordinateTransforms('EPSG:3857', baiduMercator, projzh.smerc2bmerc, projzh.bmerc2smerc)

const bmercResolutions = new Array(19)
for (let i = 0; i < 19; ++i)
  bmercResolutions[i] = 2 ** (18 - i)

export default function (settings) {
  return new Tile({
    source: new XYZ({
      projection: 'baidu',
      maxZoom: 18,
      tileUrlFunction(tileCoord) {
        let x = tileCoord[1]
        let y = -tileCoord[2] - 1
        const z = tileCoord[0]
        if (x < 0)
          x = `M${-x}`

        if (y < 0)
          y = `M${-y}`

        const index = Math.ceil(Math.random() * 5)
        return settings.url.replace(/{x}/g, x)
          .replace(/{y}/g, y)
          .replace(/{z}/g, z)
          .replace(/{n}/g, index)
      },
      tileGrid: new TileGrid({
        resolutions: bmercResolutions,
        origin: [0, 0],
      }),
    }),
  })
}

