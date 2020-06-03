import {betterURL, gradient} from '@/common/helpers';

export default {
	name: 'party-link',
	props: ['reg', 'breakpoint', 'data', 'path'],
	computed: {
		link: function () {
			var segments = [];

			segments.push(this.path || '/rejstrik');
			segments.push(betterURL(this.party.name));

			return segments.join('/');
		},
		color: function () {
			return this.party && this.party.color ? gradient(this.party) : '#eeeeeeaa'
		},
		party: function () {
			return this.data || this.$store.getters.party(this.hash);
		}
	}
};
