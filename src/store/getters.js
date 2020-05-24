import {createColorByName, checkCandidateName, betterURL, processLinks} from './helpers';

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

getters.getRegionPartyList = (state, getters) => (id) => {

  function getName (arr, parties) {

    if (!arr) return;

    var list = [];

    arr.forEach(reg => {
      if (typeof reg === 'string') list.push(reg);
      if (typeof reg === 'number') {
        var party = parties.find(p => p.reg === reg);

        if (party) {
          var link = party.short || party.name;
        } list.push(link);
      }
    });

    return list.join(', ');
  };

  function getSupport (arr) {

    if (!arr) return;
    return arr;
  };

  function getIcons (party) {
    var list = [];

    return list;
  };

  var lookup = state.dynamic.callout.find(r => r.id === id);

  var parties = [];

  if (lookup) {
    lookup.parties.forEach(party => {
      var item = {};
      var links = [];

      if (typeof party.reg === 'number') {
        var px = state.dynamic.parties.find(p => p.reg === party.reg);

        item.name = party.name || px.name;
        item.short = party.short || px.short;
        item.data = px;
        item.link = 'https://www.polist.cz/rejstrik/' + party.reg + '-' + px.hash;
        item.icons = getIcons(px);
      } else {
        item.data = {
          reg: 9999,
          color: party.color || '#aaa',
          coalition: party.reg,
          logo: party.logo
        };

        if (party.reg && party.name) {
          item.name = 'Koalice ' + getName(party.reg, state.dynamic.parties);
        } else if (party.name) {
          item.name = party.name;
        } else {
          item.name = 'Koalice ' + getName(party.reg, state.dynamic.parties);
        }

        item.originalName = party.name;

        item.icons = getIcons(party);
      }

      item.leader = party.leader;
      item.support = getSupport(party.support);
      item.list = party.list;
      item.program = party.program;

      links = party.links || [];

      item.links = {
        primary: [],
        secondary: []
      };

      if (links.length > 0) {
        processLinks(links, item.links.primary);
      }

      parties.push(item)
    });
  }

  return parties;
};

export default getters;
