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

export default mutations;
