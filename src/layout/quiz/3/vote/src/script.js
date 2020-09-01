import PartyInList from "@/components/party-in-list/do";
import QuizItem from '@/components/quiz/item/do'

export default {
	name: 'quiz-result-3',
	props: ['id'],
	data: function () {
		return {
			data: null
		}
	},
	components: {
		PartyInList,
		QuizItem
	},
	computed: {
		region: function () {
			if (!this.data) return undefined;

			return this.$store.state.static.regions.find(x => x.id === this.data.region)
		},
		parties: function () {
			return this.$store.getters.candidatesInRegion(this.region.hash);
		},
		yes: function () {
			var list = [];

			if (this.data.topics_yes) {
				String(this.data.topics_yes).split(',').forEach(item => {
					list.push(Number(item))
				});
			}

			return list;
		},
		no: function () {
			var list = [];

			if (this.data.topics_no) {
				String(this.data.topics_no).split(',').forEach(item => {
					list.push(Number(item))
				});
			}

			return list;
		},
		rf: function () {
			return document.referrer;
		}
	},
	methods: {},
	mounted: function () {
    this.$store.dispatch("ga", {title: "Hlas v anketě Volby"});
		window.scrollTo(0, 0);
		this.$store.dispatch('quizFetch', {
			quiz: 3,
			id: this.id,
			onComplete: (res) => this.data = res.values
		});
	}
};
