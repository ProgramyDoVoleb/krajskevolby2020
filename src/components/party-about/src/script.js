import LogoItem from "@/components/logo-item/do";

export default {
	name: 'party-about',
	props: ['reg', 'simple', 'size', 'partyData'],
	components: {
		LogoItem
	},
	computed: {
		party: function () {
			return this.partyData || this.$store.state.static.previous2016.parties.list.find(p => p.reg === this.reg);
		},
		coalition: function () {
			return this.party.coalition || [];
		},
		partiesGlobal: function () {
			return this.$store.state.static.previous2016.parties.list;
		},
		link: function () {

			var l = undefined;

			if (this.party.links && this.party.links.global) {
				this.party.links.global.forEach(link => {
					if (!link.icon && !link.label) {
						l = link.url;
					}
				});
			}

			return l;
		},
		icons: function () {
			var list = [];

			if (this.party.links && this.party.links.global) {
				this.party.links.global.forEach(link => {
					if (link.icon) list.push(link);
				});
			}

			return list;
		},
		partyName: function () {
			if (!this.partyData) return this.party.name;

			var list = [];

			this.party.coalition.forEach(reg => {
				var party = this.$store.state.static.previous2016.parties.list.find(p => p.reg === reg);

				if (party) list.push(party.short || party.name);
			});

			return 'Koalice:<br>' + list.join(', ');
		}
	}
};
