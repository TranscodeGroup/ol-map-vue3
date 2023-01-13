# ol-map-vue3

Vue3基于openLayers封装的地图组件库

以 https://gitee.com/newgateway/xdh-map 为基础，修改为Vue3 setup + ts版本

⚠本项目处于极其早期状态，请不要使用！


### 安装

```sh
pnpm i ol-map-vue3
```

### 用例

```ts
import { OlMap, OlMapCircle, OlMapLine, OlMapPolygon, OlMapText, OlMapHtml } from 'ol-map-vue3'
```

```html
<OlMap adapter="Amap" :center="[113.261999, 23.130592]" :zoom="14">
      <OlMapCircle :center="[113.261999, 23.130592]" :radius="1000" />
      <OlMapLine
        :coordinates="[
          [112.810186, 23.267921],
          [113.577856, 23.277534],
          [113.164495, 23.009742],
          [113.811415, 22.958749],
        ]" arrow arrow-each :stroke="{
          width: 3,
          color: '#409e00',
        }"
      />
      <OlMapPolygon
        :coordinates="[
          [112, 23],
          [113.57, 23.27],
          [113, 23],
        ]" fill="rgba(250,250,0, 0.1)" :stroke="{
          width: 1,
          color: 'red',
        }"
      />
      <OlMapText
        :coordinate="[113.261999, 23.130592]" v-bind="{
          text: '文本样例',
          font: '30px',
          fill: '#fff',
          stroke: {
            width: 3,
            color: '#409e00',
          },
          rotation: -0.5,
          backgroundFill: 'rgba(0,0,0,0.3)',
          padding: [10, 10, 5, 10],
          backgroundStroke: {
            width: 5,
            color: '#009e00',
          },
        }"
      />
      <OlMapHtml :position="[113.061999, 23.230592]">
        <div style="background-color: aquamarine;">
          HTML覆盖物
        </div>
        <button>test</button>
      </OlMapHtml>
</OlMap>
```
