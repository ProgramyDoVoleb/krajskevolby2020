import axios from 'axios';

const actions = {};

actions.demo = function (context, payload) {
  axios.post('/foobar', {
    foo: payload.foo,
    bar: payload.bar
  })
  .then(function (response) {
    context.commit('demo', response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
};

actions.ga = function (context, payload) {

  document.title = payload.title;

  payload.path = payload.path || context.state.route.fullPath.slice(1, context.state.route.fullPath.length);
  payload.path = payload.path.split('?')[0];

  if (window.gtag) {
    window.gtag('config', 'UA-4347750-22', {'page_path': payload.path, 'page_title': payload.title});
  } else {
    console.log('GA:', '/' + payload.path, ' : ', payload.title);
  }
};

actions.fetchRada = function (context, payload) {
  if (context.state.static.previous2016.coalition.length > 0) {
    console.log('Already loaded');
    return;
  }

  axios.get('https://data.programydovoleb.cz/volby/kv/2016/krajska-zastupitelstva.json').then((response) => {
    context.commit('fetchRada', response.data);
    if (payload && payload.onComplete) payload.onComplete();
  }).catch(e => {
    console.log('File not loaded', e);
  });
}

actions.fetchCallout = function (context, payload) {
  if (context.state.dynamic.callout.length > 0) {
    console.log('Already loaded');
    return;
  }

  axios.get('https://data.programydovoleb.cz/volby/kv/2020/call-out.json').then((response) => {
    context.commit('fetchCallOut', response.data);
    if (payload && payload.onComplete) payload.onComplete();
  }).catch(e => {
    console.log('File not loaded', e);
  });
}

actions.fetchTowns = function (context, payload) {

  if (context.state.dynamic.towns.length > 0) {
    console.log('Already loaded');
    return;
  }

  axios.get('https://data.programydovoleb.cz/obecne/obce-struktura.json').then((response) => {
    context.commit('fetchTowns', response.data);
    if (payload.onComplete) payload.onComplete();
  }).catch(e => {
    console.log('File not loaded');
  });
}

actions.fetchParties = function (context, payload) {
  if (context.state.dynamic.parties.length > 0) {
    console.log('Already loaded');
    return;
  }

  axios.get('https://data.programydovoleb.cz/obecne/strany.json').then((response) => {
    context.commit('fetchParties', response.data);
    if (payload && payload.onComplete) payload.onComplete();
  }).catch(e => {
    console.log('File not loaded', e);
  });
}

export default actions;
