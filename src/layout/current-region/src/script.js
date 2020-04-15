import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks} from "@/store/helpers";

export default {
	name: 'currentElectionCall',
	props: ['id'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		MapElement,
		PersonAbout
	},
	computed: {
		width: function () {
			return this.$store.state.width;
		},
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		about: function () {
			return this.$store.state.static.previous2016.coalition.find(r => r.id === this.region.id)
		},
		parties: function () {
			var lookup = this.$store.state.dynamic.callout.find(r => r.id === this.region.id);

			var parties = [];

			if (lookup) {
					lookup.parties.forEach(party => {
						var item = {};
						var links = [];

						if (typeof party.reg === 'number') {
							var px = this.$store.state.dynamic.parties.find(p => p.reg === party.reg);

							item.name = party.name || px.name;
							item.short = party.short || px.short;
							item.data = px;
							item.link =  'https://www.polist.cz/rejstrik/' + party.reg + '-' + px.hash;
							item.icons = this.getIcons(px);
						} else {
							item.data = {
								reg: 9999,
								color: party.color || '#aaa',
								coalition: party.reg,
								logo: party.logo
							};

							if (party.reg && party.name) {
								item.name = 'Koalice ' + this.getName(party.reg);
							} else if (party.name) {
								item.name = party.name;
							} else {
								item.name = 'Koalice ' + this.getName(party.reg);
							}

							item.originalName = party.name;

							item.icons = this.getIcons(party);
						}

						item.leader = party.leader;
						item.support = this.getSupport(party.support);
						item.list = party.list;
						item.program = party.program;

						var links = party.links || [];

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
		}
	},
	methods: {
		processLinks,
		getName: function (arr) {

			if (!arr) return;

			var list = [];

			arr.forEach(reg => {
				if (typeof reg === 'string') list.push(reg);
				if (typeof reg === 'number') {
					var party = this.$store.state.dynamic.parties.find(p => p.reg === reg);

					if (party) {
						var link = party.short || party.name;
					} list.push(link);
				}
			});

			return list.join(', ');
		},
		getSupport: function (arr) {

			if (!arr) return;
			return arr;
		},
		getIcons: function (party) {
			var list = [];

			return list;
		},
		ga: function () {
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky: " + this.region.name});
			window.scrollTo(0, 0);
		},
		openModal: function (party) {
			this.$store.dispatch("ge", {
				action: "open",
				category: "list_of_candidates",
				label: "Kandidátka " + party.name + " v " + this.region.short.toUpperCase()
			});
		}
	},
	mounted: function () {
		this.ga();
	},
	watch: {
		id: function () {
			this.ga();
		}
	}
};
