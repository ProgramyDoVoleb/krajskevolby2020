import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks} from "@/store/helpers";

export default {
	name: 'currentElectionCall',
	props: ['id', 'hash'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		PersonAbout,
		UpdateForm
	},
	computed: {
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		parties: function () {
			return this.$store.getters.getRegionPartyList(this.region.id);
		},
		party: function () {
			return this.parties.find(p => betterURL(p.originalName || p.name) === this.hash);
		}
	},
	methods: {
		processLinks,
		betterURL,
		ga: function () {
			this.$store.dispatch("ga", {title: (this.party.originalName || this.party.name) + ", " + this.region.name});
			// window.scrollTo(0, 0);
		}
	},
	mounted: function () {
		window.scrollTo(0, 0);
		setTimeout(() => this.ga(), 2500);
	},
	watch: {
		id: function () {
			this.ga();
		},
		hash: function () {
			this.ga();
		},
		party: function () {
			this.ga();
		}
	}
};
