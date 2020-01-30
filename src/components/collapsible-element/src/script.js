export default {
	name: 'collapsible-element',
	props: ['label', 'logo', 'open', 'tick'],
	data: function () {
		return {
			opened: false
		}
	},
	methods: {
		toggleVisible: function () {
			this.opened = !this.opened;
		}
	},
	mounted: function () {
		if (this.open) this.opened = this.open;
	},
	watch: {
		open: function () {
			if (typeof this.open != "undefined") this.opened = this.open;
		},
		tick: function () {
			if (typeof this.open != "undefined") this.opened = this.open;
		}
	}
};
