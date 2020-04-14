import Vue from 'vue';
import Router from 'vue-router';
import LayoutCurrent from '@/layout/current/do';
import LayoutCurrentRegion from '@/layout/current-region/do';
import LayoutPartyDetail from '@/layout/party-detail/do';
import LayoutPrevious2016 from '@/layout/previous2016/do';
import LayoutPrevious2016Region from '@/layout/previous2016/region/do';
import LayoutPrevious2016Program from '@/layout/previous2016/program/do';
import LayoutPrevious2016Compare from '@/layout/previous2016/compare/do';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: LayoutCurrent
    },
    {
      path: '/2016',
      name: 'Previous2016',
      component: LayoutPrevious2016
    },
    {
      path: '/2016/:id',
      name: 'Previous2016Region',
      component: LayoutPrevious2016Region,
      props: true
    },
    {
      path: '/rejstrik/:hash',
      name: 'PartyDetail',
      component: LayoutPartyDetail,
      props: true
    },
    {
      path: '/2016/:id/programove-prohlaseni',
      name: 'Previous2016Program',
      component: LayoutPrevious2016Program,
      props: true
    },
    {
      path: '/2016/:id/porovnani-vysledku-voleb',
      name: 'Previous2016Compare',
      component: LayoutPrevious2016Compare,
      props: true
    },
    {
      path: '/:id',
      name: 'CurrentRegion',
      component: LayoutCurrentRegion,
      props: true
    },
    { path: '*', redirect: '/' }
  ]
});

export default router;
