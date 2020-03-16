import Vue from 'vue';
import Router from 'vue-router';
import HomeComponent from "../src/components/HomeComponent";
import ResultComponent from "../src/components/ResultComponent";

Vue.use(Router);

export default new Router({
   mode: 'history',
   routes: [
       {
           path: process.env.VUE_APP_FRONTEND_PATH + '/',
           name: 'HomeComponent',
           component: HomeComponent
       },
       {
           path: process.env.VUE_APP_FRONTEND_PATH + '/results/',
           name: 'ResultComponent',
           component: ResultComponent
       }
   ]
});
