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

export default actions;
