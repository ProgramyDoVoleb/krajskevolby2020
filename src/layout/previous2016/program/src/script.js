import ProgramView from '@/components/program-view/do';
import axios from "axios";

export default {
	name: 'previous2016program',
	props: ['id'],
	data: function () {
		return {
			file: undefined
		}
	},
  components: {
		ProgramView
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		index: function () {
			return this.$store.state.static.regions.indexOf(this.region);
		},
		program: function () {
			return this.$store.state.static.previous2016.coalition[this.index].program.split('data/')[1];
		},
		gov: function () {
			return this.$store.state.static.previous2016.coalition[this.index].parties.sort((a, b) => b.seats.length - a.seats.length);
		}
	},
  methods: {
		load: function () {
			axios.get("https://data.programydovoleb.cz/" + this.program).then((response) => {
				this.file = response.data;
			}).catch(e => {
				console.log("File not loaded");
			});
		},
		ga: function () {
		    this.$store.dispatch("ga", {title: "Program pro " + this.region.name});
				window.scrollTo(0, 0);
		}
	},
  mounted: function () {
		this.load();
		this.ga();
	},
	watch: {
		program: function () {
			this.load();
			this.ga();
		}
	}
};
