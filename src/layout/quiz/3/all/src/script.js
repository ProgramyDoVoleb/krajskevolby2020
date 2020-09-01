import PartyInList from "@/components/party-in-list/do";
import QuizItem from '@/components/quiz/item/do';
import PartyGraphHorizontal from '@/components/party-graph-horizontal/do';
import ResultsGraph from '@/components/results-graph/do';

export default {
	name: 'quiz-results-3',
	props: ['id'],
	data: function () {
		return {
			data: null,
			region: null
		}
	},
	components: {
		PartyInList,
		QuizItem,
		PartyGraphHorizontal,
		ResultsGraph
	},
	computed: {
		parties: function () {
			if (!this.region) return undefined;

			return this.$store.getters.candidatesInRegion(this.region.hash);
		},
		partyResults: function () {
			if (!this.parties || !this.data) return undefined;

			var list = [];
			var votes = 0;

			this.parties.forEach(p => {
				list.push({reg: p.reg, party: p, votes: 0, dem: {sex: [0,0], age: [0,0,0,0]}, votesTotal: 0, votesPCT: 0})
			})

			this.data.forEach(val => {
				var p = list.find(x => x.reg === val.vote);

				if (p) {
					p.votes++;
					votes++;

					if (val.sex < 2) p.dem.sex[val.sex]++;
					if (val.age < 99) p.dem.age[val.age]++;
				}
			})

			list.forEach((x, i) => {
				x.votesTotal = votes;
				x.votesPCT = Math.round(1000 * x.votes / x.votesTotal) / 10;
			});

			return list;
		},
		partyResults_sortByVotes: function () {
			if (!this.partyResults) return undefined;

			return this.partyResults.sort((a, b) => b.votes - a.votes);
		},
		graphData: function () {
			if (!this.partyResults) return undefined;

			var list = [];

			var others = {
				short: 'Ostatní',
				logo: ['/static/icon/icon-none.svg'],
				ptc: 0,
				votes: 0,
				color: '#eee'
			}

			this.partyResults.forEach(item => {
				if (item.votesPCT < 2) {
					others.ptc += item.votesPCT;
					others.votes += item.votes;
				} else {
					list.push({
						ptc: item.votesPCT,
						votes: item.votes,
						color: item.party.color,
						logo: [item.party.logo],
						short: item.party.short,
						party: item.party
					})
				}
			});

			list.sort((a, b) => b.ptc - a.ptc);

			list.push(others);

			return {list, coef: 100 / list[0].ptc};
		},
		topicResults: function () {
			if (!this.parties || !this.data) return undefined;

			var list = [];
			var votes = 0;

			this.$store.state.static.topics.forEach((p, i) => {
				list.push({name: p, index: Number(i), votes: [0, 0, 0], dem: {sex: [[0, 0],[0, 0]], age: [[0, 0],[0, 0],[0, 0],[0, 0]]}, votesTotal: 0})
			})

			this.data.forEach(val => {
				if (val.topics_yes) String(val.topics_yes).split(',').forEach(t => {
					var p = list.find(x => x.index === Number(t));

					if (p) {
						p.votes[0]++;
						p.votes[2]++;
						votes++;

						if (val.sex < 2) p.dem.sex[val.sex][0]++;
						if (val.age < 99) p.dem.age[val.age][0]++;
					}
				})
				if (val.topics_no) String(val.topics_no).split(',').forEach(t => {
					var p = list.find(x => x.index === Number(t));

					if (p) {
						p.votes[1]++;
						p.votes[2]++;
						votes++;

						if (val.sex < 2) p.dem.sex[val.sex][1]++;
						if (val.age < 99) p.dem.age[val.age][1]++;
					}
				})
			})

			list.forEach((x, i) => {
				x.votesTotal = votes;
				// x.votesPCT = Math.round(1000 * x.votes / x.votesTotal) / 10;
			});

			list.sort((a, b) => a.name.localeCompare(b.name, 'cs'));

			return list;
		},
		topicResults_yes: function () {
			if (!this.topicResults) return undefined;

			var list = [];
			this.topicResults.forEach(x => list.push(x));
			list.sort((a, b) => b.votes[0] - a.votes[0]);

			return list.splice(0, 5);
		},
		topicResults_no: function () {
			if (!this.topicResults) return undefined;

			var list = [];
			this.topicResults.forEach(x => list.push(x));
			list.sort((a, b) => b.votes[1] - a.votes[1]);

			return list.splice(0, 5);
		}
	},
	methods: {},
	mounted: function () {
		window.scrollTo(0, 0);

		this.region = this.$store.state.static.regions.find(x => x.hash === this.id);

		this.$store.dispatch('quizFetchResults', {
			quiz: 3,
			id: this.region.id,
			onComplete: (res) => this.data = res.values
		});

		setTimeout(() => {
			this.$store.dispatch("ga", {title: "Výsledky: Volby - " + this.region.name});
		}, 500);
	}
};
