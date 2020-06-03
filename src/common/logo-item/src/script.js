import {PDV} from "@/common/helpers";

export default {
	name: 'logo-item',
	props: ['reg', 'size', 'data'],
	data: function () {
		return {
			windowSize: 0
		}
	},
	computed: {
		sizeValue: function () {
			if (this.size) {
				if (typeof this.size === 'object') {
					if (this.windowSize < 16 * this.size.breakpoint) {
						return this.size.small + 'rem'
					} else {
						return this.size.large + 'rem'
					}
				} else if (typeof this.size === 'string') {
					return this.size;
				} else {
					if (this.size < 10) {
						return this.size + 'rem';
					} else {
						return this.size + 'px';
					}
				}
			} else {
				return '2rem';
			}
		},
		party: function () {
			return this.data || this.$store.getters.getPartyByReg(Number(this.reg));
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
	},
	mounted: function () {
		this.windowSize = window.innerWidth;

		window.addEventListener("resize", () => this.windowSize = window.innerWidth);
	}
};
