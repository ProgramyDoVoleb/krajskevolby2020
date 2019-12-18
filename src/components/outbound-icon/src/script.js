export default {
	name: 'outbound-icon',
	props: ['href', 'type', 'title', 'img'],
	data: function () {
		return {}
	},
	computed: {
		myTitle: function () {
			return this.title || 'přejít na ' + this.type;
		},
		mySrc: function () {
			return this.img || '/static/icon/' + this.type + '.svg'
		}
	},
	components: {},
	methods: {
		handle_click: function () {
			this.$store.dispatch("ga", {path: "out/" + this.type + "/" + encodeURIComponent(this.href), title: "Odchozí odkaz: " + this.type});
		}
	},
	mounted: function () {}
};
