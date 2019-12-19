import PersonAbout from "@/components/person-about/do";

export default {
	name: 'region-summary',
	props: ['id'],
	components: {
		PersonAbout
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		index: function () {
			return this.$store.state.static.regions.indexOf(this.region);
		},
		parties: function () {
			return this.$store.state.static.previous2016.results[this.index].parties.sort((a, b) => b.elected.length - a.elected.length);
		},
		partiesGlobal: function () {
			return this.$store.state.static.previous2016.parties.list;
		},
		gov: function () {
			return this.$store.state.static.previous2016.coalition[this.index].parties.sort((a, b) => b.seats.length - a.seats.length);
		}
	},
	methods: {
		logo: function (reg) {
			return '/static/' + (this.partiesGlobal.find(p => p.reg === reg).logo || 'empty.png');
		},
		coal: function (reg) {
			return this.gov.find(p => p.reg === reg);
		}
	}
};
