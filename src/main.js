// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import VueSwing from 'vue-swing';
import store from './store/store';
import router from './router';
import App from './layout/app/app';
import './assets/my-style.scss';

import ComponentIconWithLabel from '@/components/icon-with-label/do';
import ComponentOutboundLink from '@/components/outbound-link/do';
import ComponentOutboundIcon from '@/components/outbound-icon/do';
import ComponentOutboundIconLabel from '@/components/outbound-icon-label/do';
import ComponentRouterIcon from '@/components/router-icon/do';
import ComponentIconElement from '@/components/icon-element/do';

Vue.config.productionTip = false;

Vue.component('vue-swing', VueSwing)

Vue.component('icon-with-label', ComponentIconWithLabel);
Vue.component('outbound-link', ComponentOutboundLink);
Vue.component('outbound-icon', ComponentOutboundIcon);
Vue.component('outbound-icon-label', ComponentOutboundIconLabel);
Vue.component('router-icon', ComponentRouterIcon);
Vue.component('icon-element', ComponentIconElement);

/* eslint-disable no-unused-vars */
const unsync = sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
