export default {
	name: 'layout-impressum',
	data: function () {
		return {}
	},
	computed: {},
	components: {},
	methods: {
		total: function (arr) {
			var sum = 0;

			arr.forEach(val => {
				sum += val.value
			})

			return sum;
		}
	},
	mounted: function () {
    this.$store.dispatch("ga", {path: "impressum", title: "Impressum"});
		window.scrollTo(0, 0);
		this.$store.dispatch("checkFundsLoaded");

	}
};
