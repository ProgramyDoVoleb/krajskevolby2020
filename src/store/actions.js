import axios from 'axios';

const actions = {};
const antiCache = 'c=' + Math.round(new Date().getTime() / 1000000);

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

actions.ge = function (context, payload) {
  if (window.gtag) {
    window.gtag('event', payload.action, {
      'event_category': payload.category || 'general',
      'event_label': payload.label || '(not set)',
      'value': payload.value || 1
    });
  } else {
    console.log('GA Event:', payload);
  }
};

actions.fetchRada = function (context, payload) {
  if (context.state.static.previous2016.coalition.length > 0) {
    console.log('Already loaded');
    return;
  }

  axios.get('https://data.programydovoleb.cz/volby/kv/2016/krajska-zastupitelstva.json?' + antiCache).then((response) => {
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

  axios.get('https://data.programydovoleb.cz/volby/kv/2020/call-out.json?' + antiCache).then((response) => {
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

  axios.get('https://data.programydovoleb.cz/obecne/strany.json?' + antiCache).then((response) => {
    context.commit('fetchParties', response.data);
    if (payload && payload.onComplete) payload.onComplete();
  }).catch(e => {
    console.log('File not loaded', e);
  });
}

actions.fetchSource = function (context, payload) {
  var lookup = context.state.dynamic.source.find(item => item.source === payload.source);

  if (lookup) {
    // console.log('Town', lookup.name, 'is known');
    if (payload && payload.onComplete) payload.onComplete();
  } else {
    try {
      axios.get('https://data.programydovoleb.cz/' + payload.source + '.json?' + antiCache).then(response => {
        context.commit('fetchSource', {
          source: payload.source,
          content: response.data,
          to: payload.to
        });

        if (payload && payload.onComplete) payload.onComplete();
      });
    } catch (e) {
      if (payload && payload.onError) payload.onError();
    }
  }
}

actions.quizToken = function (content, payload) {
  axios.get('https://krajskevolby2020.programydovoleb.cz/lib/app/api.php?action=vote/create&t=' + antiCache).then(response => {
    if (payload && payload.onComplete) payload.onComplete(response.data);
  });
}

actions.quizFetch = function (content, payload) {
  axios.get('https://krajskevolby2020.programydovoleb.cz/lib/app/api.php?action=vote/fetch&id=' + payload.id + '&quiz=' + payload.quiz + '&t=' + antiCache).then(response => {
    if (payload && payload.onComplete) payload.onComplete(response.data);
  });
}

actions.quizStore = function (content, payload) {
  var json = {};

  json.quiz = payload.meta.quiz;
  json.key = payload.meta.server.key;
  json.lock = payload.meta.check;
  json.token = payload.meta.server.token;
  json.values = payload.values;

  axios.post('https://krajskevolby2020.programydovoleb.cz/lib/app/api.php?action=vote/store&t=' + antiCache, json).then(response => {
    console.log(response);

    if (payload && payload.onComplete) payload.onComplete(response.data);
  })
}

export default actions;
