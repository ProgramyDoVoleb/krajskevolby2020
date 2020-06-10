import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";
import ProgramElement from "@/components/program-element/do";
import TwitterFeed from "@/components/twitter/do";
import CopyrightElement from "@/components/copyright/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks, truncate, personData} from "@/common/helpers";

export default {
	name: 'Person',
	props: ['regionHash', 'candidateHash', 'personHash'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		PersonAbout,
		UpdateForm,
		ProgramElement,
		TwitterFeed,
		CopyrightElement
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.regionHash)
		},
		parties: function () {
			return this.$store.getters.candidatesInRegion(this.regionHash);
		},
		party: function () {
			return this.$store.getters.candidate(this.regionHash, this.candidateHash);
		},
		data: function () {
			if (!this.party) return undefined;
			if (!this.party.data) return undefined;

			return this.$store.getters.getSource(this.party.data);
		},
		lead: function () {
			if (!this.party || !this.data || !this.data.people) return undefined;

			var list = [];

			this.data.people.forEach((item, i) => {
				list.push(personData(item, i, this.party, this.party.link))
			});

			return list;
		},
		person: function () {
			if (!this.lead) {
				if (this.party) {
					return this.party.leader;
				} else {
					return undefined;
				}
			}

			var p;

			this.lead.forEach((item, i) => {
				if (item.hash === this.personHash) {
					p = item;
					if (i === 0) p.links = this.party.leader.links;
				}
			});

			return p;
		},
		links: function () {
			if (!this.person || !this.person.links) return undefined;

			var obj = {
				facebook: this.person.links.find(x => x.icon.type === 'fb'),
				twitter: this.person.links.find(x => x.icon.type === 'tw')
			}

			return obj;
		},
		width: function () {
			return (window.innerWidth > 450 ? 378 : window.innerWidth - (16 * 4))
		}
	},
	methods: {
		processLinks,
		betterURL,
		ga: function (top) {
			this.$store.dispatch("ga", {title: this.person.name + ', ' + this.party.name + ", " + this.region.name});
			if (top) window.scrollTo(0, 0);
			this.tw();
		},
		tw: function () {
			var q = document.querySelector('#twscriptloader');

			if (q) {
				q.parentNode.removeChild(q);
			}

			this.$nextTick();

			if (!document.querySelector('#twscriptloader')) {
				var el = document.createElement('div');
						el.setAttribute('id', 'twscriptloader');

				document.querySelector('body').appendChild(el);

				var script = document.createElement('script');
						script.setAttribute('async', 'async');
						script.setAttribute('charset', 'utf-8');
						script.src = "https://platform.twitter.com/widgets.js";

				el.appendChild(script);
			}
		}
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
		regionHash: function () {
			this.ga(true);
		},
		candidateHash: function () {
			this.ga(true);
		},
		personHash: function () {
			this.ga(true);
		}
	}
};
