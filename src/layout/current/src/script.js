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
						var item = {};

						if (typeof party.reg === 'number') {
							var px = this.$store.state.dynamic.parties.find(p => p.reg === party.reg);

							item.data = px;
							item.name = '<a href="https://www.polist.cz/rejstrik/' + party.reg + '-' + px.hash + '" target="_blank">' + px.name + '</a>'
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
		}
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky"});
			window.scrollTo(0, 0);
	}
};
