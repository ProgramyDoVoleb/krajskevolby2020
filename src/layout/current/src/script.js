import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PartyList from '@/components/party-list/do';
import PersonAbout from "@/components/person-about/do";

export default {
	name: 'currentElectionCall',
	data: function () {
		return {
			clickableList: ['CZ020', 'CZ031', 'CZ032', 'CZ041', 'CZ042', 'CZ051', 'CZ052', 'CZ053', 'CZ063', 'CZ064', 'CZ071', 'CZ072', 'CZ080']
		}
	},
  components: {
		LogoItem,
		MapElement,
		PersonAbout,
		PartyList
	},
	methods: {
		getPartiesInRegion: function (region) {
			var lookup = this.$store.state.dynamic.callout.find(r => r.id === region.id);

			var parties = [];

			if (lookup) {
					lookup.parties.forEach(party => {
						var item = {};

						if (typeof party.reg === 'number') {
							var px = this.$store.state.dynamic.parties.find(p => p.reg === party.reg);

							item.data = px;
							item.name =  '<a href="https://www.polist.cz/rejstrik/' + party.reg + '-' + px.hash + '" target="_blank">' + (party.name || px.name) + '</a>'
							item.icons = this.getIcons(px);
						} else {
							item.data = {
								reg: 9999,
								color: '#aaa',
								coalition: party.reg ? this.$store.state.dynamic.parties.filter(p => party.reg.indexOf(p.reg) > -1) : []
							};

							if (party.reg && party.name) {
								item.name = '<b>Koalice:</b> <em>"' + party.name + '"</em><br>' + this.getName(party.reg);
							} else if (party.name) {
								item.name = party.name;
							} else {
								item.name = '<b>Koalice:</b><br>' + this.getName(party.reg)
							}

							item.icons = this.getIcons(party);
						}

						item.leader = party.leader;
						item.support = this.getSupport(party.support);
						item.list = party.list;

						parties.push(item)
					});
			}

			return parties;
		},
		getName: function (arr) {

			if (!arr) return;

			var list = [];

			arr.forEach(reg => {
				if (typeof reg === 'string') list.push(reg);
				if (typeof reg === 'number') {
					var party = this.$store.state.dynamic.parties.find(p => p.reg === reg);

					if (party) {
						var link = '<a href="https://www.polist.cz/rejstrik/' + reg + '-' + party.hash + '" target="_blank">' + party.name + '</a>';
					} list.push(link);
				}
			});

			return list.join('<br>');
		},
		getSupport: function (arr) {

			if (!arr) return;

			var list = [];

			arr.forEach(reg => {
				if (typeof reg === 'string') list.push(reg);
				if (typeof reg === 'number') {
					var party = this.$store.state.dynamic.parties.find(p => p.reg === reg);

					if (party) list.push(party.name);
				}
			});

			return '<b>Podpora:</b> ' + list.join(', ');
		},
		getIcons: function (party) {
			var list = [];

			return list;
		},
		clicked: function (d, e) {
			var region = this.$store.state.static.regions.find(r => r.nuts === d.data);
			this.$router.push('/' + region.hash);
		},
		getCalloutPartiesCount: function (region) {
			var sum = 0;

			this.$store.state.dynamic.callout.forEach((item, i) => {
				if (!region || region === item.id) {
					sum += item.parties.length;
				}
			});

			return sum;
		},
		getCalloutPeopleCount: function () {
			var sum = 0;

			this.$store.state.dynamic.callout.forEach((item, i) => {
				item.parties.forEach((party, i2) => {
					if (party.leader) sum++;
					if (party.list) sum += party.list.length;
				});
			});

			return sum;
		},
		gov: function (index) {
			if (!this.$store.state.static.previous2016.coalition[index]) return [];

			return this.$store.state.static.previous2016.coalition[index].parties;
		}
	},
	computed: {
		partyList: function () {
			return [];
		},
		dynamics: function () {

			if (this.$store.state.dynamic.parties.length === 0) return false;
			if (this.$store.state.dynamic.callout.length === 0) return false;

			return true;
		}
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky"});
			window.scrollTo(0, 0);
	}
};
