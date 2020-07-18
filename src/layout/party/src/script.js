import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PartyList from '@/components/party-list/do';
import PersonAbout from "@/components/person-about/do";
import TwitterFeed from "@/components/twitter/do";
import UpdateForm from "@/components/update-form/do";
import {tw} from "@/components/twitter/helpers";

import {betterURL} from "@/store/helpers";

export default {
	name: 'party-detail',
	props: ['hash'],
	data: function () {
		return {
			hoveredItem: undefined,
			hoveredItemTime: undefined,
			hoveredItemVisible: false
		}
	},
  components: {
		LogoItem,
		MapElement,
		PersonAbout,
		PartyList,
		TwitterFeed,
		UpdateForm
	},
	methods: {
		betterURL,
		hideHovered: function () {
			var d = new Date().getTime();

			if (d > this.hoveredItemTime) {
				this.hoveredItemVisible = false;
			}
		},
		ga: function () {
			this.$store.dispatch("ga", {title: this.party.name + " v krajských volbách"});
			window.scrollTo(0, 0);
			tw(this);
		},
		hovered: function (item) {
			var link = this.$store.state.static.regions.find(x => x.nuts === item.area.nuts);

			this.hoveredItem = {
				region: link,
				data: this.activity.find(x => x.region.id === link.id),
				position: {
					x: item.e.offsetX,
					y: item.e.offsetY
				}
			}

			this.hoveredItemTime = new Date().getTime() + 5000;
			this.hoveredItemVisible = true;

			setTimeout(() => this.hideHovered(), 5000);
		},
		clicked: function (item) {
			var link = this.$store.state.static.regions.find(x => x.nuts === item.data);

			this.$router.push('/' + link.hash);
		}
	},
	computed: {
		partyList: function () {
			return this.$store.getters.getPartyList();
		},
		dynamics: function () {

			if (this.$store.state.dynamic.parties.length === 0) return false;
			if (this.$store.state.dynamic.callout.length === 0) return false;

			return true;
		},
		party: function () {
			if (this.dynamics) {
				return this.$store.getters.party(this.hash);
			} else {
				return undefined;
			}
		},
		activity: function () {
			return this.$store.getters.getPartyActivityByRegion(this.party.hash);
		},
		areas: function () {
			var list = [];

			this.$store.state.static.regions.forEach(region => {
				var activity = this.activity.find(x => x.region.id === region.id);

				if (activity) {
					var obj = {};

					obj.color = this.party.color;
					if (activity.type === 0) obj.opacity = .8;
					if (activity.type === 1) obj.opacity = .4;
					if (activity.type === 2) obj.opacity = .1;
					obj.nuts = region.nuts;

					list.push(obj);
				}
			});

			return list;
		},
		links: function () {
			if (!this.party || !this.party.links || !this.party.links.globals) return undefined;

			var obj = {
				facebook: this.party.links.globals.find(x => x.icon.type === 'fb'),
				twitter: this.party.links.globals.find(x => x.icon.type === 'tw')
			}

			return obj;
		},
		clickable: function () {
			var list = [];

			this.$store.state.static.regions.forEach(region => {
				var activity = this.activity.find(x => x.region.id === region.id);

				if (activity) {
					list.push(region.nuts);
				}
			});

			return list;
		},
		width: function () {
			return (window.innerWidth > 450 ? 410 : window.innerWidth - 64)
		},
		perex: function () {
			var str = [];

			if (this.party && this.activity) {
				str.push("<em>" + this.party.name + "</em>");
				str.push("v&nbsp;krajských volbách 2020:");
				str.push("Kandiduje");

				if (this.activity.length === 1) str.push("v&nbsp;jednom kraji,");
				if (this.activity.length > 1 && this.activity.length < 5) str.push("ve " + this.activity.length + "&nbsp;krajích,");
				if (this.activity.length > 4 && this.activity.length < 12) str.push("v&nbsp;" + this.activity.length + "&nbsp;krajích,");
				if (this.activity.length > 11) str.push("ve " + this.activity.length + "&nbsp;krajích,");

				var types = [0, 0, 0];
				var leadCount = 0;

				this.activity.forEach(act => {
					types[act.type]++;

					if (act.party && act.party.leader && act.party.leader.party) {
						if (act.party.leader.party.hash === this.party.hash) leadCount++;
					}
				});

				var typesString = [];

				types.forEach((t, i) => {
					if (t > 0 && i === 0) typesString.push(t + "&times;&nbsp;samostatně");
					if (t > 0 && i === 1) typesString.push(t + "&times;&nbsp;v koalici");
					if (t > 0 && i === 2) typesString.push(t + "&times;&nbsp;podporuje jinou kandidátku");
				});

				str.push(typesString.join(", ") + ".");

				if (leadCount === 0) str.push("<em>" + (this.party.short || this.party.name) + "</em> nemá nikoho v&nbsp;čele krajské kandidátky.");
				if (leadCount === 1) str.push("Jeden člen <em>" + (this.party.short || this.party.name) + "</em> je na pozici lídra krajské kandidátky.");
				if (leadCount > 1 && leadCount < 5) str.push(leadCount + "&nbsp;členové <em>" + (this.party.short || this.party.name) + "</em> jsou lídry krajské kandidátky.");
				if (leadCount > 4) str.push(leadCount + "&nbsp;členů <em>" + (this.party.short || this.party.name) + "</em> je lídrem krajské kandidátky.");
			}

			str.push("Níže je přehled krajů, lídrů kandidátky a&nbsp;hlavních i&nbsp;regionálních odkazů na webové stránky a&nbsp;sociální sítě.")

			return str.join(" ");
		}
	},
	mounted: function () {
		setTimeout(() => this.ga(), 200);
	},
	watch: {
		hash: function () {
			this.ga();
			this.hoveredItem = undefined;
		}
	}
};
