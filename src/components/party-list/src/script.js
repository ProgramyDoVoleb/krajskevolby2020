export default {
	name: 'party-list',
	data: function () {
		return {
			prominent: [768, 53, 721, 720, 7, 1, 166, 1114, 47, 703],
			selected: undefined
		}
	},
	computed: {
		listProminent: function () {
			var list = [];

			this.$store.getters.allParties().forEach(party => {
				if (party.reg && this.prominent.indexOf(party.reg) > -1) {
					list.push(party);
				}
			});

			return list;
		},
		listOthers: function () {
			var list = [];

			this.$store.getters.allParties().forEach(party => {
				if (!party.reg || this.prominent.indexOf(party.reg) === -1) {
					list.push(party);
				}
			});

			return list;
		}
	},
	methods: {
		party: function (item) {
			this.$router.push('/rejstrik/' + (item ? item.hash : this.selected.hash));
		}
	}
};
