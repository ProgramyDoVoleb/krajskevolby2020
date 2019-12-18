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
			this.$store.dispatch("ga", {path: "out/link/" + encodeURIComponent(this.href), title: "Odchozí odkaz: " + this.content});
		}
	},
	mounted: function () {}
};
