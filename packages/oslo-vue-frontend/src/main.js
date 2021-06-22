import Vue from 'vue'
import App from './App.vue'
import routes from "../router/routes";
import store from "./store/store";
import VlUiVueComponents from'@govflanders/vl-ui-vue-components';

Vue.config.productionTip = false;

const validatorConfig = {
  inject: true,
  locale: 'nl',
};

Vue.use(VlUiVueComponents, {
  validation: validatorConfig,
});

new Vue({
  router: routes,
  store,
  render: h => h(App),
}).$mount('#app')
