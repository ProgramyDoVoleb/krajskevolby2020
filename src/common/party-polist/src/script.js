import {gradient} from '@/common/helpers';

export default {
	name: 'party-polist',
	props: ['reg', 'breakpoint', 'data'],
	computed: {
		color: function () {
			return this.party && this.party.color ? gradient(this.party) : '#eeeeeeaa'
		},
		party: function () {
			var party = this.data || this.$store.getters.getPartyByReg(Number(this.reg));

			if (!party) {
				party = {
					name: 'nezávislý',
					short: 'nezávislý',
					color: '#ccc'
				}
			}

			return party;
		}
	}
};
