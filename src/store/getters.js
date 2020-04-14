import {createColorByName, checkCandidateName, betterURL} from './helpers';

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

getters.getPartyList = (state, getters) => () => {
  if (state.dynamic.callout.length === 0) return [];
  if (state.dynamic.parties.length === 0) return [];

  var list = [];

  function add (item, party, name) {
    var found = list.find(x => x.reg === item);

    if (!found) found = list.find(x => x.name === item);

    if (!found) {
      if (party) {
        list.push({
          hash: betterURL(party.name),
          name: party.name,
          short: party.name,
          logo: party.logo,
          color: party.color || createColorByName(party.name),
          data: party
        });
      } else {
        var info = state.dynamic.parties.find(x => x.reg === item);

        if (info) {
          list.push({
            reg: info.reg,
            name: name || info.name,
            short: info.short,
            logo: info.logo,
            color: info.color,
            hash: betterURL(info.name),
            data: info
          });
        }
      }
    }
  }

  state.dynamic.callout.forEach(region => {
    region.parties.forEach((party, i) => {
      if (party.reg) {
        if (typeof party.reg === 'number') {
          add(party.reg, undefined, party.name);
        } else {
          party.reg.forEach((member, i) => {
            add(member);
          });
        }
      }
      if (party.support) {
        party.support.forEach((member, i) => {
          add(member);
        });
      }
      if (party.name) {
        if (!party.reg) {
          add(party.name, party);
        }
      }
    });
  });

  list.sort((a, b) => a.name.localeCompare(b.name, 'cs'));

  return list;
}

getters.getPartyActivityByRegion = (state, getters) => (item) => {
  if (state.dynamic.callout.length === 0) return [];

  var list = [];

  state.dynamic.callout.forEach(region => {
    var obj = {
      region: region.id,
      party: undefined,
      type: -1, // -1: nekandiduje, 0: samostatně, 1: v koalici, 2: podpora, 3: koalice
      meta: {}
    }

    region.parties.forEach((party, i) => {
      if (party.reg) {
        if (typeof party.reg === 'number') {
          if (party.reg === item) {
            obj.party = party;
            obj.type = 0;
          }
        } else {
          if (party.reg.indexOf(item) > -1) {
            obj.party = party;
            obj.type = 1;
          }
        }
      }
      if (party.support) {
        if (party.support.indexOf(item) > -1) {
          obj.party = party;
          obj.type = 2;
        }
      }
      if (party.name) {
        if (party.name === item) {
          obj.party = party;

          if (party.reg) {
            obj.type = 3;
          } else {
            obj.type = 0;
          }
        }
      }
    });

    if (obj.party) list.push(obj);
  });

  return list;
}

export default getters;
