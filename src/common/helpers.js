import store from '@/store/store';

export function PDV (url) {
  return 'https://data.programydovoleb.cz/' + url.split('data/')[1];
}

export function stripURLintoDomain (url) {
  url = url.replace('https://', '');
  url = url.replace('http://', '');
  url = url.replace('www.', '');

  if (url.charAt(url.length - 1) === '/') url = url.slice(0, -1); // '12345.0'

  return url;
};

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
      link.content = item.label || stripURLintoDomain(item.url);
    }

    if (link.link.indexOf('facebook.com') > -1) {
      link.icon.type = 'fb';
      link.icon.name = 'Facebook'
    }

    if (link.link.indexOf('twitter.com') > -1) {
      link.icon.type = 'tw';
      link.icon.name = 'Twitter'
    }

    if (link.link.indexOf('youtube.com') > -1) {
      link.icon.type = 'yt';
      link.icon.name = 'Youtube'
    }

    if (link.link.indexOf('instagram.com') > -1) {
      link.icon.type = 'ig';
      link.icon.name = 'Instagram'
    }

    if (link.link.indexOf('wikipedia.org') > -1) {
      link.icon.type = 'wiki';
      link.icon.name = 'Wikipedia'
    }

    if (link.link.indexOf('hlidac-statu.cz') > -1) {
      link.icon.type = 'hs';
      link.icon.name = 'Hlídač státu'
    }

    if (item.icon) {
      link.icon.type = item.icon;
    }

    link.icon.src = '/static/icon/' + link.icon.type + '.svg'

    list.push(link);
  });

  return list;
}
