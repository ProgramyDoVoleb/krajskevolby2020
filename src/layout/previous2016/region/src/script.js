import ResultsGraph from "@/components/results-graph/do";
import PartyAbout from "@/components/party-about/do";
import PersonAbout from "@/components/person-about/do";

export default {
	name: 'previous2016region',
	props: ['id'],
	data: function () {
		return {}
	},
  components: {
		ResultsGraph, PartyAbout, PersonAbout
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		index: function () {
			return this.$store.state.static.regions.indexOf(this.region);
		},
		parties: function () {
			return this.$store.state.static.previous2016.results[this.index].parties;
		},
		partiesGlobal: function () {
			return this.$store.state.static.previous2016.parties.list;
		},
		gov: function () {
			var list = [];

			this.$store.state.static.previous2016.coalition[this.index].parties.forEach(party => {
				party.seats.forEach(seat => {
					list.push({
						party: party,
						person: seat
					});
				});
			});

			list.sort((a, b) => a.person.level - b.person.level);

			return list;
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
				name: 'Ostatní',
				short: 'Ost',
			};

			this.parties.forEach(party => {

				if (party.ptc > max) max = party.ptc;

				if (party.ptc < 3) {
					rest.ptc += party.ptc;
				} else {
					var o = {
						name: party.name,
						short: party.short,
						ptc: party.ptc
					}

					var partyData = this.$store.state.static.previous2016.parties.list.find(p => p.reg === party.reg);

					if (partyData) {
						o.logo = [partyData.logo || "empty.png"];
						o.color = partyData.color;

						if (partyData.coalition) {
							partyData.coalition.forEach((coal, index) => {
								var coalData = this.$store.state.static.previous2016.parties.list.find(p => p.reg === coal);

								if (coalData) {
									if (o.color === "#aaa") o.color = coalData.color;
									if (coalData.logo) {
										if (index === 0 && o.logo[0] === "empty.png") {
											o.logo[0] = coalData.logo;
										} else {
											o.logo.push(coalData.logo);
										}
									} else {
										if (index > 0) {
											o.logo.push("empty.png");
										}
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

			data.coef = Math.round(10000 / max) / 100;

			return data;
		}
	},
  methods: {},
  mounted: function () {},
	watch: {}
};
