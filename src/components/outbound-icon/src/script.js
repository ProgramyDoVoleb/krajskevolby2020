export default {
	name: 'outbound-icon',
	props: ['href', 'type', 'title', 'img', 'size'],
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
			this.$store.dispatch("ge", {
				action: "outbound",
				category: "icon",
				label: this.type.toUpperCase() + ' ' + (this.title || '')
			});
		}
	},
	mounted: function () {}
};
