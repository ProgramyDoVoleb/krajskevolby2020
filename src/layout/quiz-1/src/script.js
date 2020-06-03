export default {
	name: 'layout-cookies',
	data: function () {
		return {}
	},
	computed: {
		localStorage: function () {
			var list = [];

			Object.keys(localStorage).forEach(key => {
				list.push({
					key: key,
					value: localStorage[key]
				})
			});

			return list;
		},
		cookie: function () {
			var list = [];

			document.cookie.split(";").forEach(key => {

				var content = key.split("=");

				if (content.length > 1) {
					list.push({
						key: content[0],
						value: content[1]
					})
				}

			});

			return list;
		}
	},
	components: {},
	methods: {},
	mounted: function () {
    	this.$store.dispatch("ga", {title: "Dotazník ke krajským volbám"});
		window.scrollTo(0, 0);

	}
};
