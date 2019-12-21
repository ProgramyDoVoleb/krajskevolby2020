import ResultsGraph from "@/components/results-graph/do";
import axios from "axios";

export default {
	name: 'previous2016compare',
	props: ['id'],
	data: function () {
		return {
			file: undefined,
			selectedTown: null,
			query: ''
		}
	},
  components: {
		ResultsGraph
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
		},
		districts: function () {

			var response = [];

			this.$store.state.dynamic.towns.forEach(area => {
				area.list.forEach(region => {
					if (region.nuts === this.region.nuts) response = region.list;
				});
			});

			response.forEach(district => district.list.sort((a, b) => a.name.localeCompare(b.name, 'cs')));
			response.forEach(district => district.list.forEach(town => (town.list || []).sort((a, b) => a.name.localeCompare(b.name, 'cs'))));

			return response;
		},
		numsFlatList: function () {
			var list = [];

			this.districts.forEach(d => {
				d.list.forEach(t => {
					list.push({
						num: t.num,
						nuts: d.nuts,
						tName: t.name,
						dName: d.name,
						pName: null
					});

					if (t.list) {
						t.list.forEach(p => {
							list.push({
								num: p.num,
								nuts: d.nuts,
								tName: t.name,
								dName: d.name,
								pName: p.name
							});
						});
					}
				});
			})

			return list;
		},
		queryResults: function () {
			var list = [];

			if (this.numsFlatList.length > 0 && this.query != '') {
				var found = this.numsFlatList.filter(item => item.tName.toLowerCase().split(this.query.toLowerCase()).length > 1 || (item.pName != null ? item.pName.toLowerCase().split(this.query.toLowerCase()).length > 1 : false));

				found.forEach(f => list.push(f));
			}

			return list;
		},
		results2016Town: function () {
			if (this.selectedTown) {
				return this.selectedTown.volby.kraje.find(k => k.year === 2016);
			} else {
				return undefined;
			}
		},
		results2016: function () {

			var data = {
				coef: 1,
				list: []
			}

			var list = [];
			var max = 0;

			var rest = {
				ptc: 0,
				ptc2: 0,
				name: 'Ostatní',
				short: 'Ost',
			};

			this.parties.forEach(party => {

				var partyInTown;

				if (this.results2016Town) partyInTown = this.results2016Town.result.find(p => p.reg === party.reg);

				if (party.ptc > max) max = party.ptc;
				if (partyInTown && partyInTown.pct > max) max = partyInTown.pct;

				if (party.ptc < 3) {
					rest.ptc += party.ptc;
					if (partyInTown) rest.ptc2 += partyInTown.pct;
				} else {

					var o = {
						name: party.name,
						short: party.short,
						ptc: party.ptc,
						ptc2: partyInTown ? partyInTown.pct : (this.results2016Town ? 0 : undefined),
						votes: party.votes,
						reg: party.reg
					}

					var partyData = this.partiesGlobal.find(p => p.reg === party.reg);

					if (partyData) {
						o.logo = [partyData.reg];
						o.color = partyData.color;

						var hasLogo = partyData.logo;

						if (partyData.coalition) {
							partyData.coalition.forEach((coal, index) => {
								var coalData = this.$store.state.static.previous2016.parties.list.find(p => p.reg === coal);

								if (coalData) {
									if (o.color === "#aaa") o.color = coalData.color;
									if (!partyData.logo && coalData.logo) {
										if (index === 0) o.logo = [];
										o.logo.push(coalData.reg);
									}
								}
							});
						}
					}

					list.push(o);
				}
			});

			list.sort((a, b) => b.ptc - a.ptc);

			list.push(rest);

			data.list = list;

			if (rest.ptc > max) max = rest.ptc;

			rest.ptc = Math.round(100 * rest.ptc) / 100;
			rest.ptc2 = Math.round(100 * rest.ptc2) / 100;

			data.coef = Math.round(10000 / max) / 100;

			return data;
		},
	},
  methods: {
		selectTown: function (num, nuts) {
			axios.get("https://data.programydovoleb.cz/souhrny/obce/" + nuts + "/" + num + ".json").then((response) => {
				this.selectedTown = response.data;
				window.scrollTo(0, this.$el.querySelector('.part-graph').offsetTop);
			}).catch(e => {
				console.log("File not loaded");
			});
		},
		ga: function () {
		    this.$store.dispatch("ga", {title: "Porovnání výsledků voleb: " + this.region.name});
				window.scrollTo(0, 0);
		}
	},
  mounted: function () {
		this.$store.dispatch('fetchTowns');
		this.ga();
	},
	watch: {
		program: function () {
			this.ga();
		}
	}
};
