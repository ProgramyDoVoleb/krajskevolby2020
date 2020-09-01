import QuizItem from '@/components/quiz/item/do'
import QuizList from '@/components/quiz/list/do'
import QuizCaptcha from '@/components/quiz/captcha/do'

export default {
	name: 'layout-quiz-3',
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
	        question: 'Která krajská témata jsou pro Vás důležitá?',
	        answer: [],
	        optional: false
	      },
	      {
	        question: 'Co Vás naopak vůbec netrápí?',
	        answer: [],
	        optional: false
	      }
	    ],
			tick: 0,
			view: 1
		}
	},
	computed: {
		topics: function () {
			return this.$store.state.static.topics;
		},
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
			} else if (arr.length < 3) {
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
			var vote = this.questions[0].answer.reg || this.questions[0].answer.hash;
			var topics_yes = [], topics_no = [];

			this.questions[1].answer.forEach(p => topics_yes.push(this.$store.state.static.topics.indexOf(p)));
			this.questions[2].answer.forEach(p => topics_no.push(this.$store.state.static.topics.indexOf(p)));

			return {
				vote,
				topics_yes: topics_yes.join(','),
				topics_no: topics_no.join(',')
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
					quiz: 3
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
							label: "Anketa: Témata"
						});
						this.$router.push('/anketa/volby/hlas/' + response.preview);
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
    this.$store.dispatch("ga", {path: "anketa/volby", title: "Anketa: Volby"});
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
