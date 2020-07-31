import {PDV, createColorByName, betterURL, processLinks, processPersonName} from '@/common/helpers';
import store from './store';

const getters = {
  vuexState: state => state,
  demo: (state, getters) => (id) => {
    return state.structure.find(item => item.id === id)
  }
};

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
    // color = createColorByName(checkCandidateName(name))
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

getters.getPartyActivityByRegion = (state, getters) => (hash) => {
  if (getters.allCandidates().length === 0) return [];

  var list = [];

  state.static.regions.forEach(region => {
    var obj = {
      region,
      party: undefined,
      type: -1, // -1: nekandiduje, 0: samostatně, 1: v koalici, 2: podpora, 3: koalice
    }

    getters.candidatesInRegion(region.hash).forEach(cand => {
      if (cand.hash === hash) {
        obj.party = cand;
        obj.type = 0;
      }
      if (cand.coalition && cand.coalition.find(x => x.hash === hash)) {
        obj.party = cand;
        obj.type = 1;
      }
      if (cand.support && cand.support.find(x => x.hash === hash)) {
        obj.party = cand;
        obj.type = 2;
      }
    });

    if (obj.party) list.push(obj);
  });

  return list;
}

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
    if (typeof reg === 'object') list.push(reg.name);
  });

  return list.join(', ');
};

getters.getRegionPartyList = (state, getters) => (id) => {

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

      if (party.logo) item.logo = party.logo;

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

getters.party = (state, getters) => (id) => {
  var parties = getters.allParties();

  if (parties.length === 0) return undefined;

  if (typeof id === 'number') {
    return parties.find(x => x.reg === id);
  }

  if (typeof id === 'string') {
    return parties.find(x => x.hash === id);
  }

  return undefined;
}

getters.getPartyByReg = (state, getters) => (reg) => {
  var found = state.dynamic.parties.find(party => party.reg === reg);

  if (!found) {
    found = {
      name: 'nezávislí',
      color: '#aaa'
    }
  }

  return found;
}

getters.getPartyByHash = (state, getters) => (hash) => {
  var found = state.dynamic.parties.find(party => party.hash === hash);

  if (!found) {
    found = {
      name: 'nezávislí',
      color: '#aaa'
    }
  }

  return found;
}

getters.allParties = (state, getters) => () => {
  if (state.data.parties.length > 0) return state.data.parties;
  if (state.dynamic.parties.length === 0) return [];

  var list = [];

  function checkAndAdd (obj) {
    if (!list.find(x => x.hash === obj.hash)) {
      list.push(obj);
    }
  }

  function add (reg, data) {
    var obj = {reg};
    var party;

    if (reg) {
      party = getters.getPartyByReg(reg);
      if (!party.links) party.links = {global: []};
      party.links.global.push('https://polist.cz/rejstrik/' + reg + '-' + party.hash);
    } else {
      party = getters.getPartyByHash(data.hash || betterURL(data.name));
    }

    obj.name = data.name || (party.name || 'neznámé');
    obj.hash = betterURL(obj.name);
    obj.short = data.short || (party.short || obj.name);
    obj.color = data.color || (party.color || '#aaa');
    obj.logo = data.logo || (party.logo || undefined);
    obj.coalition = data.coalition || party.coalition;

    obj.links = {globals: [], regional: []};

    if (party && party.links) {
      if (party.links.global) {
        obj.links.globals = processLinks(party.links.global);
      }
      if (party.links.regional) {
        party.links.regional.forEach(region => {
          var o = {
            region: region.region,
            links: processLinks(region.links)
          }

          obj.links.regional.push(o);
        });
      }
    }

    checkAndAdd(obj);
  }

  state.dynamic.parties.forEach(party => {
    add(party.reg, party);
  });

  // state.dynamic.callout.forEach(region => {
  //   region.parties.forEach(cand => {
  //     if (cand.reg) {
  //       add(cand.reg, {name: cand.name, color: cand.color, logo: cand.logo, coalition: cand.coalition});
  //     }
  //
  //     if (cand.coalition) {
  //       cand.coalition.forEach((member, i) => {
  //         var reg = typeof member === 'number' ? member : undefined;
  //         var obj = {};
  //
  //         if (typeof member === 'string') {
  //           obj.name = member;
  //         }
  //
  //         if (member.name) obj = member;
  //
  //         add(reg, obj);
  //       });
  //     }
  //
  //     if (cand.support) {
  //       cand.support.forEach((member, i) => {
  //         var reg = typeof member === 'number' ? member : undefined;
  //         var obj = {};
  //
  //         if (typeof member === 'string') {
  //           obj.name = member;
  //         }
  //
  //         if (member.name) obj = member;
  //
  //         add(reg, obj);
  //       });
  //     }
  //   });
  // });

  add(99, {
    'name': 'bez politické příslušnosti',
    'short': 'BEZPP',
    'hash': 'bezpp',
    'color': '#aaa',
    'logo': '/static/empty.png'
  });

  list.sort((a, b) => a.name.localeCompare(b.name, 'cs'))

  state.data.parties = list;

  return list;
}

function processName (cand, party, getters) {

  if (cand.name) return cand.name;
  if (party && party.name && party.coalition) {
    return party.name;
  }
  if (cand.coalition) {
    var s = [];

    cand.coalition.forEach(member => {
      if (typeof member === 'string') {
        s.push(member)
      } else if (typeof member === 'number') {
        var m = getters.party(member);
        s.push(m.short || m.name);
      } else if (member.name) {
        s.push(member.name);
      }
    });

    return 'Koalice ' + s.join(', ');
  }
  if (party) return party.name;
}

function processShort (cand, party) {
  if (cand.short) return cand.short;
  if (party) {
    return party.short || party.name;
  }
  return undefined;
}

function processLogo (cand, party) {
  if (cand.logo) return cand.logo;
  if (party && party.logo) return party.logo;
  return undefined;
}

function processColor (cand, party) {
  if (cand.color) return cand.color;
  if (party && party.color) return party.color;
  if (party && party.name) createColorByName(party.name);
  if (cand.name) createColorByName(cand.name);

  return createColorByName('neznámé');
}

function processCoalition (cand, getters) {
  var list = [];

  cand.forEach((item, i) => {
    if (typeof item === 'number') {
      list.push(getters.party(item));
    }
    if (typeof item === 'string') {
      list.push(getters.party(betterURL(item)));
    }
    if (typeof item === 'object' && item.name) {
      list.push(getters.party(betterURL(item.name)));
    }
  });

  return list;
}

function processImage (link) {
  if (link && link.split('fotky').length > 1) {
    return PDV(link);
  } else if (link) {
    return PDV('lide/fotky/' + link);
  } else {
    return undefined;
  }
}

function processContent (content, key) {
  var obj = {}

  if (typeof content === 'string') {
    obj.content = content;
  }

  if (typeof content === 'object') {
    obj.content = content[(key || 'content')];
    if (obj.source) obj.source = processLinks([content.source]);
  }

  return obj;
}

function processPerson (source, party, getters) {

  var obj = {};
  var person = processPersonName(source);

  // console.log(source, person);

  obj.name = person.name;
  obj.nameFull = person.nameFull;
  obj.hash = betterURL(obj.name);

  if (person.reg) obj.party = getters.party(person.reg);
  if (!obj.party && party && party.reg) obj.party = getters.party(party.reg);
  if (person.phash) obj.party = getters.party(person.phash);

  if (person.links) obj.links = processLinks(person.links);

  obj.photo = processImage(person.photo);

  if (person.about) obj.about = processContent(person.about);

  return obj;
}

getters.allCandidates = (state, getters) => () => {
  if (state.data.candidates.length > 0) return state.data.candidates;
  if (state.dynamic.callout.length === 0) return [];
  if (getters.loaded() === false) return [];

  var list = [];

  state.dynamic.callout.forEach(region => {
    region.parties.forEach(cand => {
      var obj = {
        region: state.static.regions.find(x => x.id === region.id)
      };

      var party = getters.party(cand.reg);

      if (!party && (cand.hash || cand.name)) party = getters.party(cand.hash || betterURL(cand.name));

      obj.name = processName(cand, party, getters);
      obj.short = processShort(cand, party);
      obj.logo = processLogo(cand, party);
      obj.color = processColor(cand, party);

      if (cand.reg) obj.reg = cand.reg;
      if (party && party.coalition) obj.coalition = processCoalition(party.coalition, getters);
      if (cand.coalition) obj.coalition = processCoalition(cand.coalition, getters);
      if (cand.support) obj.support = processCoalition(cand.support, getters);

      if (cand.links) obj.links = processLinks(cand.links);
      if (cand.program) obj.program = cand.program;
      if (cand.data) obj.data = 'volby/kv/2020/data/' + cand.data;

      if (cand.leader) obj.leader = processPerson(cand.leader, party, getters);

      if (cand.selected) {
        obj.selected = [];

        cand.selected.forEach((person, i) => {
          obj.selected.push(processPerson(person, party, getters));
        });
      }

      if (cand.list) {
        obj.list = [];

        cand.list.forEach((person, i) => {
          obj.list.push(processPerson(person, party, getters));
        });
      }

      if (obj.name === '' || typeof obj.name === 'undefined') {
        console.log('Neznámé');
        return;
      }

      obj.hash = betterURL(obj.name);

      obj.link = '/' + obj.region.hash + '/' + obj.hash;

      obj.copyright = cand.copyright;

      if (cand.leader) {
        obj.leader.link = obj.link + '/' + obj.leader.hash;
      }

      list.push(obj);
    });
  });

  state.data.candidates = list;

  return list;
}

getters.candidatesInRegion = (state, getters) => (hash) => {
  return getters.allCandidates().filter(x => x.region.hash === hash);
}

getters.candidate = (state, getters) => (region, hash) => {
  return getters.allCandidates().find(x => x.region.hash === region && x.hash === hash);
}

getters.loaded = (state, getters) => () => {
  return state.dynamic.source.length === 2 && getters.allParties().length > 0;
}

getters.getSource = (state, getters) => (source, to) => {
  var lookup = state.dynamic.source.find(s => s.source === source);

  if (lookup) {
    return lookup.content;
  } else {
    new Promise((resolve, reject) => {
      store.dispatch('fetchSource', {
        source: source,
        to: to,
        onComplete: () => resolve(),
        onError: () => reject(new Error('load fail'))
      });
    }).then((resolver, rejected) => {
      if (rejected) {
        return undefined;
      } else {
        lookup = state.dynamic.source.find(s => s.source === source);
        return lookup.content;
      }
    });
  }
}

export default getters;
