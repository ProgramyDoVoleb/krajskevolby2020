import PartyInList from "@/components/party-in-list/do";
import QuizItem from '@/components/quiz/item/do'

export default {
	name: 'quiz-result',
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

			if (this.data.coal_yes) {
				this.data.coal_yes.split(',').forEach(item => {
					var p = this.parties.find(x => x.hash === item)
					if (p) list.push(p)
				});
			}

			return list;
		},
		no: function () {
			var list = [];

			if (this.data.coal_no) {
				this.data.coal_no.split(',').forEach(item => {
					var p = this.parties.find(x => x.hash === item)
					if (p) list.push(p)
				});
			}

			return list;
		},
		below: function () {
			var list = [];

			if (this.data.below5) {
				this.data.below5.split(',').forEach(item => {
					var p = this.parties.find(x => x.hash === item)
					if (p) list.push(p)
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
    this.$store.dispatch("ga", {title: "Hlas v anketě"});
		window.scrollTo(0, 0);
		this.$store.dispatch('quizFetch', {
			quiz: 2,
			id: this.id,
			onComplete: (res) => this.data = res.values
		});
	}
};
