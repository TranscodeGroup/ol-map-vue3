import OlMap from './components/OlMap.vue';
import OlMapCircle from './components/OlMapCircle.vue';
import OlMapLine from './components/OlMapLine.vue';
import OlMapPolygon from './components/OlMapPolygon.vue';

export { OlMap, OlMapCircle, OlMapLine, OlMapPolygon }

const component = [OlMap, OlMapCircle, OlMapLine, OlMapPolygon]

const OlMapUI = {
  install(App: any) {
    component.forEach((item) => {
      App.component(item.name, item);
    })
  }
}

export default OlMapUI
