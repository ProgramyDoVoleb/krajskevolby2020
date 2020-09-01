import Vue from 'vue';
import Router from 'vue-router';

import LayoutHomepage from '@/layout/homepage/do';
import LayoutRegion from '@/layout/region/do';
import LayoutCandidate from '@/layout/candidate/do';
import LayoutParty from '@/layout/party/do';
import LayoutPerson from '@/layout/person/do';
import LayoutProgram from '@/layout/program/do';
import LayoutPeople from '@/layout/people/do';
import LayoutAnswers from '@/layout/answers/do';
import LayoutOverview from '@/layout/overview/do';

import LayoutPrevious2016 from '@/layout/previous2016/do';
import LayoutPrevious2016Region from '@/layout/previous2016/region/do';
import LayoutPrevious2016Program from '@/layout/previous2016/program/do';
import LayoutPrevious2016Compare from '@/layout/previous2016/compare/do';

import LayoutHelper from '@/layout/helper-2020/do';
import LayoutQ1 from '@/layout/quiz-1/do';

import LayoutQ2Quiz from '@/layout/quiz/2/quiz/do';
import LayoutQ2Vote from '@/layout/quiz/2/vote/do';
import LayoutQ2All from '@/layout/quiz/2/all/do';

import LayoutQ3Quiz from '@/layout/quiz/3/quiz/do';
import LayoutQ3Vote from '@/layout/quiz/3/vote/do';
import LayoutQ3All from '@/layout/quiz/3/all/do';

import LayoutQ4 from '@/layout/quiz/4/all/do';

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
      path: '/anketa/strany',
      name: 'Q2Quiz',
      component: LayoutQ2Quiz
    },
    {
      path: '/anketa/strany/vysledky',
      name: 'Q2All',
      component: LayoutQ2All
    },
    {
      path: '/anketa/strany/hlas/:id',
      name: 'Q2Vote',
      props: true,
      component: LayoutQ2Vote
    },
    {
      path: '/anketa/volby',
      name: 'Q3Quiz',
      component: LayoutQ3Quiz
    },
    {
      path: '/anketa/volby/vysledky/:id',
      props: true,
      name: 'Q3All',
      component: LayoutQ3All
    },
    {
      path: '/anketa/volby/hlas/:id',
      name: 'Q3Vote',
      props: true,
      component: LayoutQ3Vote
    },
    {
      path: '/anketa/jste-pripraveni-na-krajske-volby',
      name: 'Q4',
      component: LayoutQ4
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
      path: '/velky-prehled',
      name: 'Overview',
      component: LayoutOverview
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
      path: '/:id/:hash/volebni-program',
      name: 'Program',
      component: LayoutProgram,
      props: true
    },
    {
      path: '/:id/:hash/ctyri-otazky',
      name: 'Answers',
      component: LayoutAnswers,
      props: true
    },
    {
      path: '/:id/:hash/kandidatni-listina',
      name: 'CandidateList',
      component: LayoutPeople,
      props: true
    },
    {
      path: '/:regionHash/:candidateHash/:personHash',
      name: 'Person',
      component: LayoutPerson,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

export default router;
