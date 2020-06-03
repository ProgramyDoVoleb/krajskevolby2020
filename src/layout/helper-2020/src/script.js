import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks} from "@/store/helpers";

export default {
	name: 'currentElectionCall',
	props: ['id'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		MapElement,
		PersonAbout,
		UpdateForm
	},
	computed: {
		width: function () {
			return this.$store.state.width;
		},
		region: function () {
			return this.$store.state.static.regions.find(r => r.hash === this.id)
		},
		about: function () {
			return this.$store.state.static.previous2016.coalition.find(r => r.id === this.region.id)
		},
		parties: function () {
			return this.$store.getters.getRegionPartyList(this.region.id);
		}
	},
	methods: {
		processLinks,
		betterURL
	}
};
