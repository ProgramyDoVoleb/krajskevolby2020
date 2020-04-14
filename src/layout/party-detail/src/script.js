import LogoItem from '@/components/logo-item/do';
import MapElement from '@/components/map/do';
import PartyList from '@/components/party-list/do';
import PersonAbout from "@/components/person-about/do";

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
		PartyList
	},
	methods: {
		hideHovered: function () {
			var d = new Date().getTime();

			if (d > this.hoveredItemTime) {
				this.hoveredItemVisible = false;
			}
		},
		ga: function () {
			this.$store.dispatch("ga", {title: "Aktivita: " + this.party.name});
			window.scrollTo(0, 0);
		},
		hovered: function (item) {
			var link = this.$store.state.static.regions.find(x => x.nuts === item.area.nuts);

			this.hoveredItem = {
				region: link,
				data: this.activity.find(x => x.region === link.id),
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
				return this.partyList.find(x => x.hash === this.hash);
			} else {
				return undefined;
			}
		},
		activity: function () {
			return this.$store.getters.getPartyActivityByRegion(this.party.reg || this.party.name);
		},
		areas: function () {
			var list = [];

			this.$store.state.static.regions.forEach(region => {
				var activity = this.activity.find(x => x.region === region.id);

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
		clickable: function () {
			var list = [];

			this.$store.state.static.regions.forEach(region => {
				var activity = this.activity.find(x => x.region === region.id);

				if (activity) {
					list.push(region.nuts);
				}
			});

			return list;
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
