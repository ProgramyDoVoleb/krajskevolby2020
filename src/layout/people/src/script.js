import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";
import ProgramElement from "@/components/program-element/do";
import ProgramView from "@/components/program-view/do";
import TwitterFeed from "@/components/twitter/do";
import CopyrightElement from "@/components/copyright/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks, truncate, personData} from "@/common/helpers";

export default {
	name: 'People',
	props: ['id', 'hash'],
	data: function () {
		return {
			mapLoaded: false
		}
	},
  components: {
		LogoItem,
		PersonAbout,
		UpdateForm,
		ProgramElement, ProgramView,
		TwitterFeed,
		CopyrightElement
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		parties: function () {
			return this.$store.getters.candidatesInRegion(this.region.hash);
		},
		party: function () {
			return this.$store.getters.candidate(this.id, this.hash);
		},
		data: function () {
			if (!this.party) return undefined;
			if (!this.party.data) return undefined;

			return this.$store.getters.getSource(this.party.data);
		},
		width: function () {
			return (window.innerWidth > 450 ? 410 : window.innerWidth - 64)
		},
		list: function () {
			if (!this.party || !this.data || !this.data.list) return undefined;

			var l = [];

			this.data.list.forEach((item, i) => {
				l.push(personData(item, i, this.party, this.$route.fullPath))
			});

			if (this.mapLoaded === false) {
				this.mapLoaded = true;
			  Loader.async = true;
			  Loader.load(null, null, this.map);
			} else {
				// this.map();
			}

			return l;
		},
		stats: function () {
			if (!this.list) return [];

			var list = [];

			var age = 0, woman = 0, degree = 0, young = 0, bezpp = 0, l = this.list.length;

			this.list.forEach(person => {
				age += person.age;
				woman += person.sex === 2 ? 1 : 0;
				degree += (person.nameFull[0].length > 0 || person.nameFull[3].length > 0) ? 1 : 0;
				young += person.age < 30 ? 1 : 0;
				bezpp += person.member === 99 ? 1 : 0;

				// console.log(person);
			});

			function rnd (a, b) {
				return Math.round(10 * a / b) / 10
			}

			function pct (a, b) {
				return Math.round(a / b * 1000) / 10
			}

			list.push({label: "Kandidátů", big: l, pct: false});
			list.push({label: "Průměrný věk", big: rnd(age, l), pct: false});
			list.push({label: "Podíl žen", big: pct(woman, l), small: woman + ' z ' + l, pct: true});
			list.push({label: "Vysokoškoláků", big: pct(degree, l), small: degree + ' z ' + l, pct: true});
			list.push({label: "Mladších 30", big: pct(young, l), small: young + ' z ' + l, pct: true});
			list.push({label: "Nestraníků", big: pct(bezpp, l), small: bezpp + ' z ' + l, pct: true});

			return list;
		}
	},
	methods: {
		processLinks,
		betterURL,
		getMapCenter: function () {
			var b = [20, 0, 80, 20];

			this.list.forEach(t => {
				if (t.homeGPS[0] < b[0]) b[0] = t.homeGPS[0];
				if (t.homeGPS[0] > b[1]) b[1] = t.homeGPS[0];
				if (t.homeGPS[1] < b[2]) b[2] = t.homeGPS[1];
				if (t.homeGPS[1] > b[3]) b[3] = t.homeGPS[1];
			});

			return {
				x: b[0] + (b[1] - b[0]) / 2,
				y: b[2] + (b[3] - b[2]) / 2
			}
		},
		map: function () {
			var cc = this.getMapCenter();

			setTimeout(() => {
				var center = SMap.Coords.fromWGS84(cc.x, cc.y);
				var m = new SMap(JAK.gel("mapa"), center, 9);

				m.addDefaultLayer(SMap.DEF_BASE).enable();
				m.addDefaultControls();

				var layer = new SMap.Layer.Marker();
				m.addLayer(layer);
				layer.enable();

				var markers = [];

				var towns = [];

				if (this.list) {

					this.list.forEach((person, index) => {

		        var num = person.homeID;

		        if (num === 2) num = 554791; // plzen
		        if (num === 7) num = 563889; // liberec
		        if (num === 6) num = 555134; // pardubice
		        if (num === 3) num = 582786; // brno
		        if (num === 4) num = 554821; // ostrava

						var town = towns.find(x => x.num === num);

						if (!town) {
							town = {num, name: person.home, gps: person.homeGPS, list: []}
							towns.push(town);
						}

						town.list.push({name: person.name, no: index + 1})
					});
				}

				towns.forEach(town => {
					var marker = new SMap.Marker(SMap.Coords.fromWGS84(town.gps[0], town.gps[1]));

					var card = new SMap.Card();
					// card.getHeader().innerHTML = town.name;

					var content = [];

					content.push("<h4 class='smap-card-h4'>" + town.name + "</h4>")
					content.push("<ul class='list smap-card-list'>");

					town.list.forEach(person => {
						content.push("<li><span class='smap-card-no small dimm'>" + person.no + ".</span> " + person.name + "</li>")
					});

					content.push("</ul>");

					content.push("<div class='small'><a href='https://polist.cz/obec/" + town.num + "' target='_blank'>Jak se zde volí</a></div>");

					card.getBody().innerHTML = content.join('');

					marker.decorate(SMap.Marker.Feature.Card, card);
					markers.push(marker);
				});

				layer.addMarker(markers);
			}, 1000);
		},
		ga: function (top) {
			this.$store.dispatch("ga", {title: 'Kandidátní listina "' + this.party.name + '", ' + this.region.name});
		 	if (top) window.scrollTo(0, 0);
			this.tw();
		},
		tw: function () {}
	},
	mounted: function () {
		window.scrollTo(0, 0);
		setTimeout(() => {
			if (location.hash != '') {
				this.$el.querySelector("a[name=" + location.hash.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "start"});
			}
			this.ga()
		}, 1000);
	},
	watch: {
		id: function () {
			this.ga(true);
		},
		hash: function () {
			this.ga(true);
			setTimeout(() => this.map(), 100);
		},
		party: function () {
			this.ga(true);
		}
	}
};
