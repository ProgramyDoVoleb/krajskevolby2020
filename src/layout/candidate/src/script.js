import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";
import ProgramElement from "@/components/program-element/do";
import TwitterFeed from "@/components/twitter/do";
import CopyrightElement from "@/components/copyright/do";
import NotFound from "@/components/not-found/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks, truncate, personData} from "@/common/helpers";

export default {
	name: 'Candidate',
	props: ['id', 'hash'],
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
		CopyrightElement,
		NotFound
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
		data: function () {
			if (!this.party) return undefined;
			if (!this.party.data) return undefined;

			return this.$store.getters.getSource(this.party.data);
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
		linksAdditional: function () {
			if (!this.party || !this.region) return [];

			var list = [];

			var party = this.$store.getters.party(this.party.hash);

			if (party) {
				this.processLinksAll([party], list);
			}

			if (this.party.coalition) {
				this.processLinksAll(this.party.coalition, list);
			}

			if (this.party.support) {
				this.processLinksAll(this.party.support, list);
			}

			list.sort((a, b) => a.link.icon.type.localeCompare(b.link.icon.type, 'cs'))

			return list;
		},
		width: function () {
			return (window.innerWidth > 450 ? 410 : window.innerWidth - 64)
		}
	},
	methods: {
		processLinksAll: function (input, output) {
			input.forEach(p => {
				if (p.links && p.links.regional) {
					var links = p.links.regional.filter(x => x.region === this.region.id);

					links.forEach(linkSet => {
						linkSet.links.forEach(link => {
							if (!this.party.links || !this.party.links.find(x => x.link === link.link)) output.push({
								party: p,
								link
							});
						});
					});
				}
			});
		},
		processLinks,
		betterURL,
		ga: function (top) {
			if (this.party) {
				this.$store.dispatch("ga", {title: this.party.name + ", " + this.region.name});
			}
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
