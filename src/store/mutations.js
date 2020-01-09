const mutations = {
  demo (state, payload) {}
};

mutations.fetchTowns = function (state, payload) {
  payload.hierarchy.list.forEach(item => state.dynamic.towns.push(item));
}

mutations.fetchRada = function (state, payload) {
  payload.forEach(item => state.static.previous2016.coalition.push(item));
}

export default mutations;
