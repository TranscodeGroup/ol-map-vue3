<script lang="ts">
// 声明额外的选项 组件名称
export default {
  name: 'OlMapHtml',
}
</script>
<script setup lang="ts">
import { onMounted, onUnmounted, watch, inject } from 'vue';
import { htmlProps } from '../types/html';
import Overlay from 'ol/Overlay';

const props = defineProps(htmlProps)

// 注入一个值，若为空则使用提供的默认值
const myMap: any = inject('myMap', null)

let show = $ref(false)
const olMapHtml = $ref<HTMLElement | undefined>()
let overlay = $ref<Overlay>()

const init = () => {
  show = true
  if (!olMapHtml) return
  const opts = {
    ...props,
    element: olMapHtml
  }
  overlay = new Overlay(opts as any)
  try {
    myMap.getMap().addOverlay(overlay)
    setPosition(props.visible ? props.position : null)
  } catch (e) {
    //
  }
}
const setPosition = (position: any) => {
  if (!overlay) return
  overlay.setPosition(props.visible ? position : null)
}
const dispose = () => {
  if (overlay && myMap?.getMap()) {
    myMap.getMap().removeOverlay(overlay)
  }
}

onMounted(() => {
  setTimeout(() => {
    myMap?.mapReady(init)
  }, 1000)
})

onUnmounted(() => {
  dispose()
});

watch(
  () => props,
  () => {
    try {
      dispose()
      init()
    } catch (e) {
      //
    }
  },
  {
    deep: true
  }
)

</script>

<template>
  <div v-show="show" ref="olMapHtml" class="my-map-html">
    <slot />
  </div>
</template>