const mutations = {
  demo (state, payload) {}
};

mutations.fetchTowns = function (state, payload) {
  payload.hierarchy.list.forEach(item => state.dynamic.towns.push(item));
}

export default mutations;
