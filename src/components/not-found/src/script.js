import PartyList from '@/components/party-list/do';

export default {
	name: 'not-found',
	props: ['region', 'parties'],
	data: function () {
		return {}
	},
  components: {
		PartyList
	},
	methods: {
	},
	computed: {
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "404 Not Found"});
			window.scrollTo(0, 0);
	}
};
