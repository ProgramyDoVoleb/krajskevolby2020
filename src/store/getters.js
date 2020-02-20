import {createColorByName, checkCandidateName} from './helpers';

const getters = {
  vuexState: state => state,
  demo: (state, getters) => (id) => {
    return state.structure.find(item => item.id === id)
  }
};

getters.getPartyByReg = (state, getters) => (reg) => {
  return state.dynamic.parties.find(party => party.reg === reg) || state.dynamic.partyList.find(party => party.reg === reg);
}

getters.getGradientForCoalition = (state, getters) => (party, name) => {
  var color;

  if (typeof party === 'object' && party.color === '#aaa' && party.coalition) {
    var arr = [];
    var clr = [];

    party.coalition.forEach(reg => {
      arr.push(getters.getPartyByReg(reg).color);
    });

    arr.forEach((a, i) => {
      clr.push(a + ' ' + i / (arr.length - 1) * 100 + '%');
    });

    color = 'linear-gradient(20deg, ' + clr.join(', ') + ')';
  }

  if (typeof party === 'object' && party.color === '#aaa' && !party.coalition) {
    color = party.color;
  }

  if (typeof party === 'object' && party.color !== '#aaa') {
    color = party.color;
  }

  if (typeof party === 'number' && party === 90) {
    color = createColorByName(name)
  }

  if (typeof party === 'number' && party === 80) {
    color = createColorByName(checkCandidateName(name))
  }

  return color;
}

export default getters;
