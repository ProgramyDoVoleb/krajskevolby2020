import ProgramView from '@/components/program-view/do';

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
			return '/static/' + this.$store.state.static.previous2016.coalition[this.index].program;
		},
		gov: function () {
			return this.$store.state.static.previous2016.coalition[this.index].parties.sort((a, b) => b.seats.length - a.seats.length);
		}
	},
  methods: {
		load: function () {
			var self = this;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
			  if (this.readyState == 4 && this.status == 200) {
			    self.file = JSON.parse(this.responseText);
			  }
			};
			xmlhttp.open("GET", this.program, true);
			xmlhttp.send();
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
