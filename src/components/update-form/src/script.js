import axios from 'axios';

export default {
	name: 'update-form',
	props: ['region', 'party', 'index', 'hints', 'notes'],
	components: {},
	data: function () {
		return {
			url: '',
			note: '',
			sent: false,
			sending: false,
			showHints: true
		}
	},
	computed: {
		valid: function () {
			return /^(http|https):\/\/[^ "]+$/.test(this.url);
		}
	},
	methods: {
		send: function () {
			if (this.valid) {
				this.sending = true;

				axios.post('https://krajskevolby2020.programydovoleb.cz/lib/app/api.php?action=tip/add', {
					region: {
						id: this.region.id,
						short: this.region.short
					},
					party: {
						index: this.index || -1,
						name: this.party ? (this.party.name || 'neznámá') : 'nová'
					},
					source: encodeURIComponent(this.url),
					note: encodeURIComponent(this.note)
				}).then(response => {
					this.sending = false;
					this.sent = true;
				});
			}
		},
		another: function () {
			this.sent = false;
			this.url  = '';
			this.note = this.notes || '';
		}
	},
	mounted: function () {
		this.note = this.notes || '';
		if (typeof this.hints != 'undefined') this.showHints = this.hints;
	}
};
