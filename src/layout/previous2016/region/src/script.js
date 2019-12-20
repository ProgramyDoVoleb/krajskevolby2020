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
			return this.$store.state.static.previous2016.results[this.index].parties.sort((a, b) => b.elected.length - a.elected.length);
		},
		partiesGlobal: function () {
			return this.$store.state.static.previous2016.parties.list;
		},
		gov: function () {
			return this.$store.state.static.previous2016.coalition[this.index].parties.sort((a, b) => b.seats.length - a.seats.length);
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
						ptc: party.ptc,
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

			data.coef = Math.round(10000 / max) / 100;

			return data;
		},
		review: function () {

			var copy = [];

			var winner = this.results2016.list[0];

			copy.push("Vítězem krajských voleb 2016 byli kandidáti " + (winner.coalition ? winner.name : winner.short) + ".");
			copy.push("Celkem získali " + this.results2016.list[0].ptc + " % hlasů, volilo je " + this.results2016.list[0].votes + " lidí.");

			if (!this.gov.find(p => p.reg === winner.reg)) {
				copy.push("Přesto nejsou součástí Rady kraje.")
			}

			var coal = [];
			var coalID = [];
			var coalSeats = 0;
			this.gov.forEach(g => {
				var party = this.parties.find(p => p.reg === g.reg);
				coalSeats += g.seats.length;
				coal.push(party.coalition ? party.name : party.short);
				coalID.push(g.reg);
			});

			copy.push("Radu kraje tvoří " + coalSeats + " radních z " + coal.slice(0, coal.length - 1).join(", ") + " a " + coal[coal.length - 1] + ".");

			var seats = 0;
			var seatsCoal = 0;
			this.parties.forEach(party => {
				seats += party.elected.length;
				if (coalID.indexOf(party.reg) > -1) seatsCoal += party.elected.length;
			});
			var majority = Math.round(100 * seatsCoal / seats) > 50 ? "většinu" : "měnšinu";

			copy.push("Tyto strany mají v zastupitelstvu " + seatsCoal + " z celkem " + seats + " křesel, " + majority + " " + (Math.round(100 * seatsCoal / seats)) + " %.");

			return copy.join(" ");
		}
	},
  methods: {
		ga: function () {
				this.$store.dispatch("ga", {title: "Detail kraje: " + this.region.name});
				window.scrollTo(0, 0);
		}
	},
  mounted: function () {
		this.ga();
	},
	watch: {
		id: function () {
			this.ga();
		}
	}
};
