export default {
	name: 'donio',
	data: function () {
		return {
			delay: false
		}
	},
	computed: {
		enhanced: function () {
			return this.$store.getters.getSource('volby/settings');
		},
		donio: function () {
			if (!this.enhanced) return false;

			return this.enhanced && this.enhanced.donio && this.enhanced.donio.active && this.enhanced.donio.active === 1
		}
	},
	mounted: function () {
		setTimeout(() => this.delay = true, 2000);
	}
};
