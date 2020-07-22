import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";
import PartyInList from "@/components/party-in-list/do";

import {betterURL, beautifyDate, stripURLintoDomain, processLinks} from "@/common/helpers";

export default {
	name: 'Region',
	props: ['id'],
	data: function () {
		return {

		}
	},
  components: {
		LogoItem,
		MapElement,
		PersonAbout,
		UpdateForm,
		PartyInList
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
			return this.$store.getters.candidatesInRegion(this.region.hash);
		}
	},
	methods: {
		processLinks,
		betterURL,
		ga: function () {
			this.$store.dispatch("ga", {title: "Ohlášené kandidátky: " + this.region.name});
			window.scrollTo(0, 0);
		},
		openModal: function (party) {
			this.$store.dispatch("ge", {
				action: "open",
				category: "list_of_candidates",
				label: "Kandidátka " + party.name + " v " + this.region.short.toUpperCase()
			});
		}
	},
	mounted: function () {
		this.ga();
	},
	watch: {
		id: function () {
			this.ga();
		}
	}
};
