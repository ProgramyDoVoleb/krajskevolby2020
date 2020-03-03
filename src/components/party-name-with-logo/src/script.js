import {PDV} from "@/store/helpers";

export default {
	name: 'party-name-with-logo',
	props: ['reg', 'useName', 'useShort', 'item'],
	computed: {
		src: function () {
			if (this.item) {
				return this.$store.state.server + this.item.logo
			} else {
				return this.party && this.party.logo ? this.$store.state.server + this.party.logo : '/static/empty.png';
			}
		},
		name: function () {
			if (this.item) {
				return this.item.name
			} else {
				if (this.useName) {
					return this.useName
				} else {
					return this.party ? this.party.name : ''
				}
			}
		},
		short: function () {
			if (this.useShort) {
				return this.useShort
			} else {
				return this.party ? this.party.short : undefined
			}
		},
		link: function () {
			if (this.item) {
				return this.item.link
			} else {
				return this.party ? this.party.reg + '-' + this.party.hash : '';
			}
		},
		party: function () {
			return this.$store.getters.getPartyByReg(Number(this.reg));
		}
	},
	methods: {
		PDV
	},
	mounted: function () {
		if (!this.item) {
			// this.$store.dispatch('fetchPartyList');
		}
	}
};
