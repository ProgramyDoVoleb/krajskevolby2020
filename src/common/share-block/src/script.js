export default {
	name: 'share-block',
	props: ['path', 'text'],
	data: function () {
		return {
			copied: false
		}
	},
	computed: {
		link: function () {
			if (this.path) {
				return "https://krajskevolby2020.programydovoleb.cz" + this.path
			} else {
				return location.href
			}
		}
	},
	methods: {
		copy: function () {
			navigator.clipboard.writeText(this.link);
			this.copied = true;

				this.$store.dispatch("ge", {
					action: "copy",
					category: "share",
					label: this.link
				});

			setTimeout(() => this.copied = false, 1000);
		}
	}
};
