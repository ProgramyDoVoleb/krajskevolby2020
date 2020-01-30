import LogoItem from '@/components/logo-item/do';

export default {
	name: 'currentElectionCall',
	data: function () {
		return {

		}
	},
  components: {
		LogoItem
	},
	methods: {
		getPartiesInRegion: function (region) {
			var lookup = this.$store.state.dynamic.callout.find(r => r.id === region.id);

			var parties = [];

			if (lookup) {
					lookup.parties.forEach(party => {
						if (typeof party.reg === 'number') {
							var px = this.$store.state.dynamic.parties.find(p => p.reg === party.reg)
							parties.push({data: px, leader: party.leader, icons: this.getIcons(px)})
						} else {
							parties.push({data: {reg: 9999, color: '#aaa', coalition: party.reg ? this.$store.state.dynamic.parties.filter(p => party.reg.indexOf(p.reg) > -1) : [], name: party.name || this.getName(party.reg), icons: this.getIcons(party)}, leader: party.leader})
						}
					});
			}

			console.log(parties);

			return parties;
		},
		getName: function (coalition) {

			var list = [];

			coalition.forEach(reg => {
				var party = this.$store.state.dynamic.parties.find(p => p.reg === reg);

				if (party) list.push(party.name);
			});

			return 'Koalice: ' + list.join(', ');
		},
		getIcons: function (party) {
			var list = [];

			return list;
		}
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky"});
			window.scrollTo(0, 0);
	}
};
