export default {
	name: 'outbound-link',
	props: ['href', 'title', 'content', 'addon'],
	data: function () {
		return {}
	},
	computed: {
		hasAddon: function () {
			if (typeof this.addon != "undefined") return this.addon;

			return true;
		}
	},
	components: {},
	methods: {
		handle_click: function () {
			this.$store.dispatch("ge", {
				action: "outbound",
				category: "link",
				label: this.content || this.title
			});
		}
	},
	mounted: function () {}
};
