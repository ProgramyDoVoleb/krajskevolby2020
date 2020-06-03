export default {
	name: 'collapsible-element',
	props: ['label', 'logo', 'open', 'tick', 'seo'],
	data: function () {
		return {
			opened: false
		}
	},
	methods: {
		toggleVisible: function () {
			this.opened = !this.opened;

			this.$store.dispatch("ge", {
				action: this.seo && this.seo.action ? this.seo.action : "collapsible_state_change",
				category: this.seo && this.seo.category ? this.seo.category : "engagement",
				label: (this.seo && this.seo.label ? this.seo.label : "Změna zobrazení: ") + this.label,
				value: this.opened ? 1 : 0
			});
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
