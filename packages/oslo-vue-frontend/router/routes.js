import Vue from 'vue';
import Router from 'vue-router';
import HomeView from "../src/views/HomeView";
import ResultView from "../src/views/ResultView";

Vue.use(Router);

export default new Router({
   mode: 'history',
   routes: [
       {
           path: '/',
           name: 'Home',
           component: HomeView
       },
       {
           path: '/results/',
           name: 'Result',
           component: ResultView
       }
   ]
});
