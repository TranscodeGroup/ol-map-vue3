<script setup lang="ts">
import { ref } from 'vue';
let adapter = ref("Amap")
</script>

<template>
  <header>

  </header>

  <main>
    <!-- <OlMap :key="adapter" :adapter="adapter">
      <MyMapCircle :center="[113.261999, 23.130592]" :radius="1000" />
      <MyMapLine :coordinates="[
        [112.810186, 23.267921],
        [113.577856, 23.277534],
        [113.164495, 23.009742],
        [113.811415, 22.958749]
      ]" arrow arrowEach />
      <MyMapPolygon :coordinates="[
        [112, 23],
        [113.57, 23.27],
        [113, 23],
      ]" />
      <MyMapText :coordinate="[113.261999, 23.130592]" v-bind="{
        text: '文本样例',
        font: '30px',
        fill: '#fff',
        stroke: {
          width: 3,
          color: '#409e00'
        },
        rotation: -0.5,
        backgroundFill: 'rgba(0,0,0,0.3)',
        padding: [10, 10, 5, 10],
        backgroundStroke: {
          width: 5,
          color: '#009e00'
        }
      }" />
    </OlMap>
    <MukButton @click="adapter = 'Baidu'">aowu</MukButton> -->
    <!-- <OlMap :key="adapter" :adapter="adapter">
      <MyMapCircle :center="[113.261999, 23.130592]" :radius="1000" />
      <MyMapLine :coordinates="[
        [112.810186, 23.267921],
        [113.577856, 23.277534],
        [113.164495, 23.009742],
        [113.811415, 22.958749]
      ]" arrow arrowEach />
      <MyMapPolygon :coordinates="[
        [112, 23],
        [113.57, 23.27],
        [113, 23],
      ]" />
      <MyMapText :coordinate="[113.261999, 23.130592]" v-bind="{
        text: '文本样例',
        font: '30px',
        fill: '#fff',
        stroke: {
          width: 3,
          color: '#409e00'
        },
        rotation: -0.5,
        backgroundFill: 'rgba(0,0,0,0.3)',
        padding: [10, 10, 5, 10],
        backgroundStroke: {
          width: 5,
          color: '#009e00'
        }
      }" />
      <my-map-html :position="[113.061999, 23.230592]">
        <div style="background-color: aquamarine;">HTML覆盖物</div>
      </my-map-html>
      <my-map-popup :position="[113.161999, 23.130592]" title="标题">
        主体内容
      </my-map-popup>
      <my-map-marker :coordinate="[113.261999, 23.330592]"></my-map-marker>
      <my-map-marker :coordinate="[113.481999, 23.130592]" :active-index="10" :src="pin" trigger="click">
        <template v-slot="{marker}">
          坐标：{{marker.coordinate}} <br>
          数据项：{{marker.items}} <br>
          集群: {{marker.cluster}} <br>
        </template>
      </my-map-marker>
    </OlMap> -->

  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
