import RegionSummary from "@/components/region-summary/do";

export default {
	name: 'previous2016',
	data: function () {
		return {}
	},
  components: {
		RegionSummary
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "Přehled 2016"});
			window.scrollTo(0, 0);
	}
};
