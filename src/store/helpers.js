export function PDV (url) {
  return 'https://data.polist.cz/' + url;
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

export function betterURL (url) {
  var newURL = url;

  newURL = newURL.toLowerCase();
  newURL = newURL.replaceAll(' ', '-');
  newURL = newURL.replaceAll('.', '');
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

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  if (s === '') return '';

  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function createColorByName (name) {
  return toColor(name.hashCode());
}

export function checkCandidateName (name) {
  var dash = name.split(' - ');
  var coma = dash[0].split(',');
  var parts = coma[0].split(' ');
  var family;

  if (parts.length > 2) {
    var second = parts.splice(1);
    if (second[0].length === 1) {
      family = second.join('');
    } else {
      family = second.join(' ');
    }

  } else {
    family = parts[1];
  }

  var case1 = parts[0].toLowerCase();
  var case2 = family ? family.toLowerCase() : '';

  return capitalize(case1) + ' ' + capitalize(case2);
}

export function processLinks (source, target) {

  var t = target || [];

  if (source.length > 0) {

    source.forEach(link => {
      var o = {
        content: stripURLintoDomain(link.url),
        link: link.url,
        icon: {
          src: '/static/icon/link.svg',
          name: 'WWW: '
        }
      }

      if (link.icon) {
        o.icon.name = link.icon;
        o.icon.src = '/static/icon/' + link.icon + '.svg';
      }

      if (link.icon === 'wiki') {
        o.content = 'Wikipedia';
      }

      ['wikipedia.org', 'facebook.com', 'youtube.com', 'instagram.com', 'twitter.com'].forEach(s => {
        if (o.content.split(s).length > 1) {
          o.content = o.content.split(s)[1]
        }
      });

      if (link.label) o.content = link.label;

      t.push(o);
    });
  }

  return t;
}
