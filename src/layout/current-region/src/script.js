import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";

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

						parties.push(item)
					});
			}

			return parties;
		}
	},
	methods: {
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
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky"});
			window.scrollTo(0, 0);
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
