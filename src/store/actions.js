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

export default actions;
