import QuizItem from '@/components/quiz/item/do'
import QuizList from '@/components/quiz/list/do'
import QuizCaptcha from '@/components/quiz/captcha/do'

export default {
	name: 'layout-quiz-4',
	data: function () {
		return {
			demographics: {
				region: null
			},
	    questions: [
	      {
	        question: 'Krajské volby se konají ...',
					options: ['1. října', '2. a 3. října', '9. a 10. října', '6. a 7. listopadu', '17. listopadu', 'příští rok'],
	        answer: null,
	        correct: '2. a 3. října'
	      },
	      {
	        question: 'Voličský průkaz lze využít ...',
					options: ['pouze v mém kraji', 've všech krajích, kde se volí', 'v celé republice', 'kdekoli v ČR a na libovolné zahraniční ambasádě', 'pouze na poště', 'nikde'],
	        answer: null,
					correct: 'pouze v mém kraji'
	      },
	      {
	        question: 'Jakou formou mohou hlasovat lidé, kteří budou v době voleb v karanténě?',
					options: ['z auta v okresním městě', 'přes internet', 'poštou', 've vyhrazené volební místnosti', 'požádají příjezd volební komise s přenosnou urnou', 'volební stan na náměstí'],
	        answer: [],
					correct: ['z auta v okresním městě', 've vyhrazené volební místnosti', 'požádají příjezd volební komise s přenosnou urnou']
	      },
	      {
	        question: 'Kolik kandidátů je možné zakroužkovat?',
	        options: ['žádného', 'jednoho', 'dva', 'čtyři', 'pětinu', 'až deset'],
					answer: null,
					correct: 'čtyři'
	      },
	      {
	        tmp: 'Která strana nebo koalice jde do voleb s volebním heslem:',
					question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
					tmp: 'Kdo je lídrem kandidátky %?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
	        tmp: '% je lídrem které strany nebo koalice?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
					tmp: 'Kdo z lídrů je na fotografii?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
	        tmp: 'Na které fotografii je %?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
	        tmp: 'Kdo je na fotografii?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
	        tmp: 'Která straně nebo koalici patří tohle logo:',
	        question: null,
	        options: [],
					answer: null,
					correct: null
	      },
	      {
	        tmp: 'Které logo používá %?',
	        question: null,
	        options: [],
					answer: null,
					correct: null
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
		results: function () {
			var list = [];
			var count = 0;

			if (this.view === 14) {
				this.questions.forEach((q, i) => {
					var correct = false;

					if (i === 2) {
						if (q.answer.length === 3) {
							var c = 0;

							q.answer.forEach(a => {
								if (q.correct.find(x => x === a)) c++;
							});

							if (c === 3) correct = true;
						}
					} else if (i === 9) {
						if (q.answer.person.hash === q.correct.person.hash) correct = true;
					} else {
						if (q.answer === q.correct) correct = true;
					}

					if (correct === true) {
						count++;
					}

					list.push({correct, q})
				});
			}

			return {count, list};
		}
	},
	components: {
		QuizItem, QuizList, QuizCaptcha
	},
	methods: {
		handle_reset: function () {
			this.questions.forEach((q, i) => {
				if (i === 2) {
					q.answer = [];
				} else {
					q.answer = null;
				}
				if (i > 3) q.options = [];
			})

			this.view = 1;
		},
		prepareRest: function (id, options, list) {
			while (options.length < (list.length < 6 ? list.length : 6)) {
				var index = Math.floor(Math.random() * (list.length - 1));

				if (options.indexOf(list[index]) === -1) options.push(list[index]);
			}

			options.forEach((opt, index) => {
				if (index === 0) {
					var content = typeof options[0] === 'number' ? list[options[0]] : options[0]
					this.questions[id].correct = content;
					this.questions[id].options.push(content);
				} else {
					if (Math.random() < .5) {
						this.questions[id].options.unshift(options[index]);
					} else {
						this.questions[id].options.push(options[index]);
					}
				}
			})
		},
		prepareMotto: function (id) {
			var list = [];

			this.parties.forEach((p, i) => {
				if (p.motto) {
					list.push({p, i});
				}
			})

			var options = [];
					options.push(list[Math.floor(Math.random() * (list.length - 1))].p); // select

			this.prepareRest(id, options, this.parties)
		},
		prepareLeader: function (id) {
			var options = [];
					options.push(this.parties[Math.floor(Math.random() * (this.parties.length - 1))]); // select

			this.prepareRest(id, options, this.parties);
		},
		preparePictureOfPerson: function (id, leaderOnly, allOptions) {
			var valid = [];
			var all = [];

			this.parties.forEach((party, i) => {
				if (party.leader) {
					if (party.leader.photo) {
						valid.push({person: party.leader, party})
					}
					all.push({person: party.leader, party})
				}

				if (leaderOnly === false && party.list) {
					party.list.forEach(person => {
						if (person.photo) {
							valid.push({person, party})
						}
						all.push({person, party})
					})
				}
			})

			var options = [];
					options.push(valid.splice(Math.floor(Math.random() * valid.length), 1)[0]); // select

			if (allOptions === true) {
				this.prepareRest(id, options, all)
			} else {
				this.prepareRest(id, options, valid)
			}
		},
		prepareLogoOfParty: function (id, allOptions) {
			var valid = [];
			var all = [];

			this.parties.forEach((party, i) => {
				if (party.logo) {
					valid.push(party);
				}
				all.push(party);
			})

			var options = [];
					options.push(valid.splice(Math.floor(Math.random() * valid.length), 1)[0]); // select

			if (allOptions === true) {
				this.prepareRest(id, options, all)
			} else {
				this.prepareRest(id, options, valid)
			}
		},
		prepareQuestions: function (id, content) {
			this.questions[id].question = this.questions[id].tmp.split('%').join(content);
		},
		prepareContent: function (region) {
			// if (this.view > 1 && !this.parties) return undefined;

			this.prepareMotto(4);
			this.prepareLeader(5);
			this.prepareLeader(6);
			this.preparePictureOfPerson(7, true, true);
			this.preparePictureOfPerson(8, true, false);
			this.preparePictureOfPerson(9, false, true);
			this.prepareLogoOfParty(10, true);
			this.prepareLogoOfParty(11, false);

			this.prepareQuestions(4, '');
			this.prepareQuestions(5, this.questions[5].correct.name);
			this.prepareQuestions(6, this.questions[6].correct.leader.name);
			this.prepareQuestions(7, '');
			this.prepareQuestions(8, this.questions[8].correct.person.name + ', lídr kandidátky ' + this.questions[8].correct.party.name);
			this.prepareQuestions(9, '');
			this.prepareQuestions(10, '');
			this.prepareQuestions(11, this.questions[11].correct.name);
		},
		handle_view: function (index) {
			this.view = typeof index === 'number' ? index : this.view + 1;
			if (this.view === 2) {
				// console.log('prepare');
				this.prepareContent();
			}
			if (this.view === 14) {
				setTimeout(() => {
					this.$store.dispatch("ge", {
						action: "quiz-complete",
						category: "quiz",
						label: "Kvíz: " + this.results.count
					});
				}, 500);
			}
			window.scrollTo(0, 0);
		},
		handle_multiple: function (arr, val) {
			if (arr.find(x => x === val)) {
				arr.splice(arr.indexOf(val), 1);
			} else {
				arr.push(val);
			}
		}
	},
	mounted: function () {
    this.$store.dispatch("ga", {title: "Kvíz ke krajským volbám 2020"});
		window.scrollTo(0, 0);
	}
};
