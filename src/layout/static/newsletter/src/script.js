export default {
	name: 'layout-newsletter',
	data: function () {
		return {}
	},
	computed: {},
	components: {},
	methods: {},
	mounted: function () {
    	this.$store.dispatch("ga", {title: "Odebírejte týdenní shrnutí"});
		window.scrollTo(0, 0);
	}
};
