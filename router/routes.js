import Vue from 'vue';
import Router from 'vue-router';
import HomeComponent from "../src/components/HomeComponent";
import ResultComponent from "../src/components/ResultComponent";

Vue.use(Router);

export default new Router({
   routes: [
       {
           path: '/',
           name: 'HomeComponent',
           component: HomeComponent
       },
       {
           path: '/results',
           name: 'ResultComponent',
           component: ResultComponent
       }
   ]
});
