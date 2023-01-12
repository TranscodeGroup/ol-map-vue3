export interface Props {
  zoom?: number
  minZoom?: number
  maxZoom?: number
  center?: number[]
  adapter?: string | object | Function
  projection?: string
  width?: string
  height?: string
  dragPan?: boolean
  mouseWheelZoom?: boolean
  mapOptions?: object
  viewOptions?: object
  invert?: boolean
  filter?: object
}
