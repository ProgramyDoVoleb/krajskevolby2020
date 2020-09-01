import LogoItem from '@/components/logo-item/do';
import QuestionAnswer from "@/components/question-answer/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks, truncate, personData} from "@/common/helpers";

export default {
	name: 'QuestionAnswers',
	props: ['id', 'hash'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		QuestionAnswer
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		parties: function () {
			return this.$store.getters.candidatesInRegion(this.region.hash);
		},
		party: function () {
			return this.$store.getters.candidate(this.id, this.hash);
		},
		questions: function () {
			return this.$store.getters.getSource('volby/kv/2020/odpovedi/otazky');
		},
		answers: function () {
			if (!this.party) return undefined;
			if (!this.party.answersLink) return undefined;

			return this.$store.getters.getSource(this.party.answersLink);
		},
		data: function () {
			if (!this.party) return undefined;
			if (!this.party.data) return undefined;

			return this.$store.getters.getSource(this.party.data);
		},
		lead: function () {
			if (!this.party || !this.data || !this.data.list || !this.data.people) return undefined;

			var list = [];

			for (var i = 0; i < 5; i++) {
				if (i < this.data.list.length) {
					var pp = personData(this.data.list[i], i, this.party, this.$route.fullPath, this.data);

					var lookup = this.data.people.find(x => x.name === pp.name);

					if (lookup) {
				    var about = {
				      full: lookup.about,
				      mid: truncate(lookup.about, 40),
				      short: truncate(lookup.about)
				    };

				    var quote = {
				      full: lookup.quote,
				      mid: truncate(lookup.quote, 40),
				      short: truncate(lookup.quote)
				    };

						pp.about = about;
						pp.quote = quote;
					} else {
						pp.about = {full: undefined, mid: undefined, short: undefined};
						pp.quote = {full: undefined, mid: undefined, short: undefined};
					}

					list.push(pp);
				}
			}

			if (this.answers) {

				if (list.length === 0) {
					list.push(personData(this.answers.leader, i, this.party, this.$route.fullPath, this.data))
				} else {
			    var about = {
			      full: this.answers.leader.about,
			      mid: truncate(this.answers.leader.about, 40),
			      short: truncate(this.answers.leader.about)
			    };

			    var quote = {
			      full: this.answers.leader.quote,
			      mid: truncate(this.answers.leader.quote, 40),
			      short: truncate(this.answers.leader.quote)
			    };

					if (!list[0].about || list[0].about.full != about.full) {
						list[0].about = about;
					}

					if (!list[0].quote || list[0].quote.full != quote.full) {
						list[0].quote = quote;
					}
				}
			}

			return list;
		},
		links: function () {
			if (!this.party || !this.party.links) return undefined;

			var obj = {
				facebook: this.party.links.find(x => x.icon.type === 'fb'),
				twitter: this.party.links.find(x => x.icon.type === 'tw')
			}

			return obj;
		},
		width: function () {
			return (window.innerWidth > 450 ? 410 : window.innerWidth - 64)
		}
	},
	methods: {
		processLinks,
		betterURL,
		ga: function (top) {
			this.$store.dispatch("ga", {title: 'Program "' + this.party.name + '", ' + this.region.name});
		 	if (top) window.scrollTo(0, 0);
			this.tw();
		},
		tw: function () {}
	},
	mounted: function () {
		window.scrollTo(0, 0);
		setTimeout(() => {
			if (location.hash != '') {
				this.$el.querySelector("a[name=" + location.hash.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "start"});
			}
			this.ga()
		}, 1000);
	},
	watch: {
		id: function () {
			this.ga(true);
		},
		hash: function () {
			this.ga(true);
		},
		party: function () {
			this.ga(true);
		}
	}
};
