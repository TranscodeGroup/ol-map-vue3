import OlMap from './components/OlMap.vue';
import OlMapCircle from './components/OlMapCircle.vue';
import OlMapLine from './components/OlMapLine.vue';
import OlMapPolygon from './components/OlMapPolygon.vue';
import OlMapText from './components/OlMapText.vue';
import OlMapHtml from './components/OlMapHtml.vue';

export { OlMap, OlMapCircle, OlMapLine, OlMapPolygon, OlMapText, OlMapHtml }

const component = [OlMap, OlMapCircle, OlMapLine, OlMapPolygon, OlMapText,  OlMapHtml]

const OlMapUI = {
  install(App: any) {
    component.forEach((item) => {
      App.component(item.name, item);
    })
  }
}

export default OlMapUI
