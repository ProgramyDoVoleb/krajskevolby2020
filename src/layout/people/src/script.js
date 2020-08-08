import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";
import ProgramElement from "@/components/program-element/do";
import ProgramView from "@/components/program-view/do";
import TwitterFeed from "@/components/twitter/do";
import CopyrightElement from "@/components/copyright/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks, truncate, personData} from "@/common/helpers";

export default {
	name: 'People',
	props: ['id', 'hash'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		PersonAbout,
		UpdateForm,
		ProgramElement, ProgramView,
		TwitterFeed,
		CopyrightElement
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
		width: function () {
			return (window.innerWidth > 450 ? 410 : window.innerWidth - 64)
		},
		list: function () {
			if (!this.party || !this.data || !this.data.list) return undefined;

			var l = [];

			this.data.list.forEach((item, i) => {
				l.push(personData(item, i, this.party, this.$route.fullPath))
			});

			return l;
		}
	},
	methods: {
		processLinks,
		betterURL,
		ga: function (top) {
			this.$store.dispatch("ga", {title: 'Kandidátní listina "' + this.party.name + '", ' + this.region.name});
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