import axios from "axios";
import RegionMenu from "@/components/region-menu/do";

export default {
	name: 'app',
    data: function () {
      return {}
    },
    components: {
      RegionMenu
    },
    computed: {
			loaded: function () {
				return this.$store.getters.loaded() || this.$store.state.data.candidates.length > 0;
			},
			loadedNum: function () {
				if (this.loaded) {
					var el = document.querySelector(".loading");
					if (el) el.classList.add("loaded");
				}

				return this.$store.state.data.candidates.length;
			}
    },
    methods: {
			resize: function () {
				var el = document.querySelector('.content-width');

				if (el) {
					this.$store.commit('setWidth', el.offsetWidth);
				}
			}
    },
    mounted: function () {
			this.$store.dispatch('fetchRada');

			this.$store.getters.getSource('volby/kv/2020/strany', 'parties');
			this.$store.getters.getSource('volby/kv/2020/list2', 'callout');

			window.addEventListener('resize', () => this.resize());
			setTimeout(() => this.resize(), 1000);
			this.resize();
    },
    watch: {
    }
};
