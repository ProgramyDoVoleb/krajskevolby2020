import {stripURLintoDomain} from '@/common/helpers';

export default {
	name: 'outbound-link',
	props: ['href', 'title', 'content', 'addon', 'look', 'category'],
	data: function () {
		return {}
	},
	computed: {
		hasAddon: function () {
			if (typeof this.addon != "undefined") return this.addon;

			return false;
		}
	},
	components: {},
	methods: {
		stripURLintoDomain,
		handle_click: function () {
			this.$store.dispatch("ge", {
				action: "outbound",
				category: this.category || "link",
				label: this.href
			});
		}
	},
	mounted: function () {}
};
