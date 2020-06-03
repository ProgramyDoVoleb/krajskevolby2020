export default {
	name: 'share-block',
	data: function () {
		return {
			copied: false
		}
	},
	methods: {
		copy: function () {
			navigator.clipboard.writeText(location.href);
			this.copied = true;

				this.$store.dispatch("ge", {
					action: "copy",
					category: "share",
					label: this.$route.fullPath
				});

			setTimeout(() => this.copied = false, 1000);
		}
	}
};
