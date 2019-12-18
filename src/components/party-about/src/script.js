export default {
	name: 'party-about',
	props: ['reg', 'switchDesktop', 'single'],
	computed: {
		party: function () {
			return this.$store.state.static.previous2016.parties.list.find(p => p.reg === this.reg);
		},
		coalition: function () {
			return this.party.coalition || [];
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
		}
	}
};
