export default {
	name: 'party-name-with-dot',
	props: ['reg', 'useName', 'useShort', 'useColor', 'alwaysName', 'alwaysShort', 'partyData', 'noLink'],
	computed: {
		color: function () {
			if (this.useColor) {
				return this.useColor;
			} else {
				return this.party && this.party.color ? this.gradient(this.party) : '#eeeeeeaa'
			}
		},
		name: function () {
			if (this.useName) {
				return this.useName
			} else {
				return this.party ? (this.alwaysShort && this.short ? this.short : this.party.name) : ''
			}
		},
		name2: function () {
			if (this.useName) {
				return this.useName
			} else {
				return this.party ? this.party.name : ''
			}
		},
		short: function () {
			if (this.useShort) {
				return this.useShort
			} else {
				return this.party ? (this.alwaysName ? this.name : this.party.short) : undefined
			}
		},
		link: function () {
			return this.party ? this.party.reg + '-' + this.party.hash : '';
		},
		party: function () {
			var party = this.partyData || this.$store.getters.getPartyByReg(Number(this.reg));

			if (!party) {
				party = {
					name: this.useName || 'nezávislý'
				}
			}

			return party;
		}
	},
	methods: {
		gradient: function (party) {
			var color = party.color;

			if (party.color === "#aaa" && party.coalition) {
				var arr = [];
				var clr = [];

				party.coalition.forEach(reg => {
					arr.push(this.$store.getters.getPartyByReg(reg).color);
				});

				arr.forEach((a, i) => {
					clr.push(a + " " + i / (arr.length - 1) * 100 + "%");
				});

				var css = "linear-gradient(20deg, " + clr.join(", ") + ")";

				return css;

			} else {
				return party.color;
			}
		}
	},
	mounted: function () {
		// this.$store.dispatch('fetchPartyList');
	}
};
