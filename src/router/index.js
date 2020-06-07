import Vue from 'vue';
import Router from 'vue-router';

import LayoutHomepage from '@/layout/homepage/do';
import LayoutRegion from '@/layout/region/do';
import LayoutCandidate from '@/layout/candidate/do';
import LayoutParty from '@/layout/party/do';
import LayoutPerson from '@/layout/person/do';

import LayoutPrevious2016 from '@/layout/previous2016/do';
import LayoutPrevious2016Region from '@/layout/previous2016/region/do';
import LayoutPrevious2016Program from '@/layout/previous2016/program/do';
import LayoutPrevious2016Compare from '@/layout/previous2016/compare/do';

import LayoutHelper from '@/layout/helper-2020/do';
import LayoutQ1 from '@/layout/quiz-1/do';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: LayoutHomepage
    },
    {
      path: '/dotaznik-ke-krajskym-volbam',
      name: 'Q1',
      component: LayoutQ1
    },
    {
      path: '/2016',
      name: 'Previous2016',
      component: LayoutPrevious2016
    },
    {
      path: '/helper-2020',
      name: 'Helper2020',
      component: LayoutHelper
    },
    {
      path: '/2016/:id',
      name: 'Previous2016Region',
      component: LayoutPrevious2016Region,
      props: true
    },
    {
      path: '/rejstrik/:hash',
      name: 'Party',
      component: LayoutParty,
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
      name: 'Region',
      component: LayoutRegion,
      props: true
    },
    {
      path: '/:id/:hash',
      name: 'Candidate',
      component: LayoutCandidate,
      props: true
    },
    {
      path: '/:regionHash/:candidateHash/:personHash',
      name: 'Person',
      component: LayoutPerson,
      props: true
    },
    { path: '*', redirect: '/' }
  ]
});

export default router;
