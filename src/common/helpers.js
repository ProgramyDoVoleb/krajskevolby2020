import store from '@/store/store';

export function PDV (url) {

  var root = store.state.root || store.state.server;

  if (url.split('data/').length > 1) {
    return root + url.split('data/')[1];
  } else {
    return root + url;
  }

}

export function stripURLintoDomain (url) {
  url = url.replace('https://', '');
  url = url.replace('http://', '');
  url = url.replace('www.', '');

  if (url.charAt(url.length - 1) === '/') url = url.slice(0, -1); // '12345.0'

  return url;
};

export function truncate (str, count) {

  if (!str) return undefined;

  var limit = count || 20;
  var words = str.split(' ');
  var add = str.length > limit ? '...' : '';

  return words.splice(0, limit).join(' ') + add;
}

/* eslint-disable no-extend-native */
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export function beautifyNumber (num) {
  var str = num.toString().split('');

  if (str.length > 6) {
    str.splice(str.length - 3, 0, ' ');
    str.splice(str.length - 7, 0, ' ');
  } else if (str.length > 3) {
    str.splice(str.length - 3, 0, ' ');
  }

  return str.join('');
}

export function beautifyDate (date) {
  var day = date % 100;
  var month = Math.floor(date / 100) % 100;
  var year = Math.floor(date / 10000);

  return day + '. ' + month + '. ' + year;
}

export function betterURL (url) {
  var newURL = url;

  newURL = newURL.toLowerCase();
  newURL = newURL.replaceAll(' ', '-');
  newURL = newURL.replaceAll('.', '-');
  newURL = newURL.replaceAll(',', '-');
  newURL = newURL.replaceAll('–', '-');
  newURL = newURL.replaceAll('?', '');
  newURL = newURL.replaceAll('!', '');
  newURL = newURL.replaceAll('(', '');
  newURL = newURL.replaceAll(')', '');
  newURL = newURL.replaceAll('á', 'a');
  newURL = newURL.replaceAll('č', 'c');
  newURL = newURL.replaceAll('ď', 'd');
  newURL = newURL.replaceAll('é', 'e');
  newURL = newURL.replaceAll('ě', 'e');
  newURL = newURL.replaceAll('í', 'i');
  newURL = newURL.replaceAll('ľ', 'l');
  newURL = newURL.replaceAll('ň', 'n');
  newURL = newURL.replaceAll('ó', 'o');
  newURL = newURL.replaceAll('ř', 'r');
  newURL = newURL.replaceAll('š', 's');
  newURL = newURL.replaceAll('ť', 't');
  newURL = newURL.replaceAll('ú', 'u');
  newURL = newURL.replaceAll('ů', 'u');
  newURL = newURL.replaceAll('ý', 'y');
  newURL = newURL.replaceAll('ž', 'z');

  return newURL;
}

String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function toColor (num) {
  num >>>= 0;
  var b = num & 0xFF;
  var g = (num & 0xFF00) >>> 8;
  var r = (num & 0xFF0000) >>> 16;
  return 'rgb(' + [r, g, b].join(',') + ')';
}

export function createColorByName (name) {
  return toColor(name.hashCode());
}

export function gradient (party, getters) {
  if (party.color === '#aaa' && party.coalition) {
    var arr = [];
    var clr = [];

    if (!getters) getters = store.getters;

    party.coalition.forEach(reg => {
      arr.push(getters.getPartyByReg(reg).color);
    });

    arr.forEach((a, i) => {
      clr.push(a + ' ' + i / (arr.length - 1) * 100 + '%');
    });

    var css = 'linear-gradient(20deg, ' + clr.join(', ') + ')';

    return css;

  } else {
    return party.color;
  }
}

export function color (data, getters) {
  var party;

  if (!getters) getters = store.getters;

  if (data.member) {
    if (typeof data.member === 'number') {
      party = getters.getPartyByReg(data.member);
    }
  }

  if (((party && party.reg === 99) || !party) && data.nominee) {
    if (typeof data.nominee === 'number') {
      party = getters.getPartyByReg(data.nominee);
    }
  }

  if (party) {
    return party.color;
  } else {
    return '#aaa';
  }
}

export function processLinks (links) {
  var list = [];

  links.forEach((item, i) => {
    var link = {
      content: '',
      icon: {
        type: 'link',
        name: 'Webové stránky'
      },
      link: ''
    };

    if (typeof item === 'string') {
      link.link = item;
      link.content = stripURLintoDomain(item);
    } else {
      link.link = item.url;
      link.content = stripURLintoDomain(item.url);
    }

    function checkDomains (domain, type, label) {
      if (link.link.indexOf(domain) > -1) {
        link.icon.type = type;
        link.icon.name = label;
        link.content = link.content.split(domain)[1];
      }
    }

    checkDomains('facebook.com', 'fb', 'Facebook');
    checkDomains('twitter.com', 'tw', 'Twitter');
    checkDomains('youtube.com', 'yt', 'Youtube');
    checkDomains('instagram.com', 'ig', 'Instagram');
    checkDomains('wikipedia.org', 'wiki', 'Wikipedia');
    checkDomains('hlidac-statu.cz', 'hlidac-statu', 'Hlídač státu');
    checkDomains('polist.cz', 'polist', 'Polist.cz');

    if (item.icon) {
      link.icon.type = item.icon;
    }

    link.icon.src = '/static/icon/' + link.icon.type + '.svg';

    if (link.content.length > 40) {
      link.content = link.content.substring(0, 40) + '...';
    }

    if (item.label) link.content = item.label;

    list.push(link);
  });

  return list;
}

export function personData (item, i, party, route, data) {
  var obj = {};

  var p = processPersonName((item.nameFull || item.name) || item);

  obj.name = p.name;
  obj.nameFull = p.nameFull;

  obj.party = (item.phash || item.reg) ? store.getters.party(item.phash || item.reg) : undefined;

  if (item.about) {
    obj.about = {
      full: item.about,
      mid: truncate(item.about, 40),
      short: truncate(item.about)
    };
  }
  if (item.quote) {
    obj.quote = {
      full: item.quote,
      mid: truncate(item.quote, 40),
      short: truncate(item.quote)
    };
  }

  obj.photo = item.photo ? PDV('lide/fotky/' + item.photo) : '/static/missing.png';
  obj.hash = betterURL(obj.name);
  obj.link = route + '/' + obj.hash;
  obj.links = item.links ? processLinks(item.links) : [];
  obj.sex = item.sex;
  obj.age = Number(item.age);
  obj.work = item.work;
  obj.home = item.home;
  obj.homeID = item.homeMeta.num;
  obj.homeGPS = item.homeMeta.gps;
  obj.member = item.reg;
  obj.nominee = item.nominee;

  if (data && data.list) {
    var pp = data.list.find(x => x.nameFull[2] === obj.nameFull[2] && x.nameFull[1] === obj.nameFull[1]);

    if (pp && pp.links) {
      var px = processLinks(pp.links);

      px.forEach(link => {
        if (!obj.links.find(x => x.link === link.link)) obj.links.push(link);
      })
    }

    if (pp && pp.photo) {
      obj.photo = PDV('lide/fotky/' + pp.photo);
    }
  }

  return obj;
}

export function processPersonName (source) {

  var parts;
  var person;

  if (typeof source === 'string') {
    person = {
      name: source,
      nameFull: ['', '', '', '']
    }

    parts = source.split(' ');

    if (parts.length === 2) {
      person.nameFull[1] = parts[0];
      person.nameFull[2] = parts[1];
    }

  } else if (typeof source === 'object' && source.length && source.length === 4) {
    person = {
      name: source[1] + ' ' + source[2],
      nameFull: source
    }
  } else if (typeof source === 'object' && source.name) {
    person = source;

    if (typeof source.name === 'string') {
      person.nameFull = ['', '', '', ''];

      parts = source.name.split(' ');

      if (parts.length === 2) {
        person.nameFull[1] = parts[0];
        person.nameFull[2] = parts[1];
      }
    } else {
      person.fullName = source.name;
      person.name = source.name[1] + ' ' + source.name[2];
    }
  }

  return person;
}
