// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import VueSwing from 'vue-swing';
import store from './store/store';
import router from './router';
import App from './layout/app/app';
import './assets/my-style.scss';

import './common/components';

import ComponentPartyNameWithDot from '@/components/party-name-with-dot/do';
import ComponentPartyNameWithLogo from '@/components/party-name-with-logo/do';

Vue.config.productionTip = false;

Vue.component('vue-swing', VueSwing)

Vue.component('party-name-with-dot', ComponentPartyNameWithDot);
Vue.component('party-name-with-logo', ComponentPartyNameWithLogo);

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
