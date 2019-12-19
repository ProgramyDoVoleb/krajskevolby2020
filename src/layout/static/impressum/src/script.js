export default {
	name: 'layout-impressum',
	data: function () {
		return {}
	},
	computed: {},
	components: {},
	methods: {},
	mounted: function () {
    this.$store.dispatch("ga", {path: "impressum", title: "Impressum"});
		window.scrollTo(0, 0);

	}
};
