import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import {
  VlCore,
  VlUtil,
  VlRegion,
  VlGrid,
  VlColumn,
  VlLayout
} from '@govflanders/vl-ui-vue-components';

Vue.component('vl-grid', VlGrid);
Vue.component('vl-region', VlRegion);
Vue.component('vl-column', VlColumn);
Vue.component('vl-layout', VlLayout);

Vue.use(VlCore);
Vue.use(VlUtil);

new Vue({
  render: h => h(App),
}).$mount('#app')
