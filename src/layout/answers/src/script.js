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
		lead: function () {
			if (!this.party || !this.data || !this.data.people) return undefined;

			var list = [];

			this.data.people.forEach((item, i) => {
				list.push(personData(item, i, this.party, this.$route.fullPath))
			});

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