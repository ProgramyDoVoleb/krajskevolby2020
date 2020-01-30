import {PDV} from "@/store/helpers";

export default {
	name: 'logo-item',
	props: ['reg', 'size', 'data'],
	computed: {
		sizeValue: function () {
			if (this.size) {
				if (this.size < 10) {
					return this.size + 'rem';
				} else {
					return this.size + 'px';
				}
			} else {
				return '2rem';
			}
		},
		party: function () {
			return this.data || this.$store.state.static.previous2016.parties.list.find(p => p.reg === this.reg);
		},
		coalition: function () {
			if (!this.party.coalition) return null;

			var list = [];

			this.party.coalition.forEach(reg => {
				var party = this.$store.state.dynamic.parties.find(p => p.reg === (reg.reg || reg));

				if (party) list.push(party);
			});

			return list;
		}
	},
	methods: {
		PDV
	}
};
