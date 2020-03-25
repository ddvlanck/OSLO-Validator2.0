import Vue from 'vue'
import App from './App.vue'
import routes from "../router/routes";
import store from "./store/store";


Vue.config.productionTip = false;

import {
  VlCore,
  VlUtil,
  VlRegion,
  VlGrid,
  VlColumn,
  VlLayout,
  VlTabs,
  VlTab,
  VlUpload,
  VlInputField,
  VlTextarea,
  VlTitle,
  VlSelect,
  VlButton,
  VlInfoTile,
  VlActionGroup,
  VlLink,
  VlIcon,
  VlSpotlight
} from '@govflanders/vl-ui-vue-components';

Vue.component('vl-grid', VlGrid);
Vue.component('vl-region', VlRegion);
Vue.component('vl-column', VlColumn);
Vue.component('vl-layout', VlLayout);
Vue.component('vl-tabs', VlTabs);
Vue.component('vl-tab', VlTab);
Vue.component('vl-upload', VlUpload);
Vue.component('vl-input-field', VlInputField);
Vue.component('vl-textarea', VlTextarea);
Vue.component('vl-title', VlTitle);
Vue.component('vl-select', VlSelect);
Vue.component('vl-button', VlButton);
Vue.component('vl-info-tile', VlInfoTile);
Vue.component('vl-action-group', VlActionGroup);
Vue.component('vl-link', VlLink);
Vue.component('vl-icon', VlIcon);
Vue.component('vl-spotlight', VlSpotlight);

Vue.use(VlCore);
Vue.use(VlUtil);

new Vue({
  router: routes,
  store,
  render: h => h(App),
}).$mount('#app')
