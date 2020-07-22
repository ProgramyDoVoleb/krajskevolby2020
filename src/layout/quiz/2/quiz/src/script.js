import QuizItem from '@/components/quiz/item/do'
import QuizList from '@/components/quiz/list/do'
import QuizCaptcha from '@/components/quiz/captcha/do'

export default {
	name: 'layout-quiz',
	data: function () {
		return {
			server: null,
			serverCheck: '',
			captcha: [false, false, false, false, false, false, false, false, false],
		  demographics: {
		    region: null,
		    age: {
					selected: 99,
					options: [
						{val: 99, copy: 'Nechci uvádět'},
						{val: 0, copy: 'mladší 30 let'},
						{val: 1, copy: '30 až 45 let'},
						{val: 2, copy: '45 až 60 let'},
						{val: 3, copy: 'starší než 60 let'}
					]
				},
		    sex: {
					selected: 99,
					options: [
						{val: 99, copy: 'Nechci uvádět'},
						{val: 0, copy: 'Žena'},
						{val: 1, copy: 'Muž'},
						{val: 2, copy: 'Jiné'}
					]
				}
		  },
	    questions: [
	      {
	        question: 'Koho byste volili?',
	        answer: null,
	        optional: false
	      },
	      {
	        question: 'Koho byste přibrali do koalice?',
	        answer: [],
	        optional: true
	      },
	      {
	        question: 'Koho byste naopak do koalice určitě nevzali?',
	        answer: [],
	        optional: true
	      },
	      {
	        question: 'Jsou strany, u kterých si vyloženě přejete, aby u voleb získaly méně než 5 % hlasů a do zastupitelstva kraje se tak nedostaly?',
	        answer: [],
	        optional: true
	      }
	    ],
			tick: 0,
			view: 1
		}
	},
	computed: {
 		parties: function () {
			if (!this.demographics.region) return [];
			return this.$store.getters.candidatesInRegion(this.demographics.region.hash);
		},
		buttons: function () {
			if (!this.server) return [];

			var list = [];

			this.server.question.split('').forEach((val, index) => {
				if (index % 3 === 0 && index < 25) {
					list.push({
						copy: val.toUpperCase() === val ? 'X' : ['A', 'O', 'Z', 'L'][Math.floor(Math.random()*4)]
					})
				}
			});

			return list;
		}
	},
	components: {
		QuizItem, QuizList, QuizCaptcha
	},
	methods: {
		handle_view: function (index) {
			this.view = typeof index === 'number' ? index : this.view + 1;
			window.scrollTo(0, 0);
		},
		handle_multiple: function (arr, val) {
			if (arr.find(x => x === val)) {
				arr.splice(arr.indexOf(val), 1);
			} else {
				arr.push(val);
			}
		},
		quizCaptchaString: function () {
			var s = [];

			this.captcha.forEach((item, i) => {
				if (item === true) {
					s.push(i);
				}
			});

			return s.join(',');
		},
		quizCaptcha: function (index, btn) {
			this.captcha[index] = !this.captcha[index];
			this.serverCheck = this.quizCaptchaString();
			this.tick++;
		},
		quizToken: function (response) {
			this.server = response;
			this.captcha = [false, false, false, false, false, false, false, false, false];
		},
		quizAnswers: function () {
			var vote = this.questions[0].answer.hash;
			var coal_yes = [], coal_no = [], below5 = [];

			this.questions[1].answer.forEach(p => coal_yes.push(p.hash));
			this.questions[2].answer.forEach(p => coal_no.push(p.hash));
			this.questions[3].answer.forEach(p => below5.push(p.hash));

			return {
				vote,
				coal_yes: coal_yes.join(','),
				coal_no: coal_no.join(','),
				below5: below5.join(',')
			}
		},
		quizDemographics: function () {
			return {
				region: this.demographics.region.id,
				sex: this.demographics.sex.selected,
				age: this.demographics.age.selected
			}
		},
		quizStore: function () {
			this.$store.dispatch('quizStore', {
				meta: {
					server: this.server,
					check: this.quizCaptchaString(),
					quiz: 2
				},
				values: {
					d: this.quizDemographics(),
					q: this.quizAnswers()
				},
				onComplete: (response) => {
					if (response.code === 200) {
						this.$store.dispatch("ge", {
							action: "vote-added",
							category: "vote",
							label: "Anketa: Strany"
						});
						this.$router.push('/anketa/strany/hlas/' + response.preview);
					}
					this.quizToken(response);
				}
			})
		},
		quizInit: function () {
			this.$store.dispatch('quizToken', {
				onComplete: (response) => {
					this.quizToken(response);
				}
			})
		}
	},
	mounted: function () {
    this.$store.dispatch("ga", {path: "anketa/strany", title: "Anketa: Strany"});
		window.scrollTo(0, 0);
		this.quizInit();
		if (this.$route.query) {
			if (this.$route.query.kde) {
				this.demographics.region = this.$store.state.static.regions.find(x => x.hash === this.$route.query.kde);
				this.handle_view(2);
			}
			if (this.$route.query.koho) {
				this.questions[0].answer = this.$store.getters.candidatesInRegion(this.$route.query.kde).find(x => x.hash === this.$route.query.koho);
				this.handle_view(3);
			}
		}
	}
};
