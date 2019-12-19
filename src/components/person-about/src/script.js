import LogoItem from "@/components/logo-item/do";

export default {
	name: 'person-about',
	props: ['name', 'party', 'nominatedBy', 'link'],
	components: {
		LogoItem
	},
	computed: {
		partyData: function () {
			if (!this.party) return undefined;

			return this.$store.state.static.previous2016.parties.list.find(p => p.reg === this.party);
		},
		nominatedByData: function () {
			if (!this.nominatedBy) return undefined;

			return this.$store.state.static.previous2016.parties.list.find(p => p.reg === this.nominatedBy);
		},
		displayName: function () {
			return this.name;
		}
	}
};
