const mutations = {
  demo (state, payload) {}
};

mutations.fetchTowns = function (state, payload) {
  payload.hierarchy.list.forEach(item => state.dynamic.towns.push(item));
}

mutations.fetchRada = function (state, payload) {
  payload.forEach(item => state.static.previous2016.coalition.push(item));
}

mutations.fetchCallOut = function (state, payload) {
  payload.regions.forEach(item => state.dynamic.callout.push(item));
}

mutations.fetchParties = function (state, payload) {
  payload.list.forEach(item => state.dynamic.parties.push(item));
}

mutations.setWidth = function (state, payload) {
  state.width = payload;
}

mutations.fetchSource = function (state, payload) {
  var lookup = state.dynamic.source.find(s => s.source === payload.source);

  if (lookup) {
    // console.log(lookup.source, 'already in store');
  } else {
    state.dynamic.source.push({
      source: payload.source,
      content: payload.content
    });

    if (payload.to) {
      if (!state.dynamic[payload.to]) {
        state.dynamic[payload.to] = [];
      }

      payload.content.list.forEach(item => state.dynamic[payload.to].push(item));
    }
  }
}

export default mutations;
