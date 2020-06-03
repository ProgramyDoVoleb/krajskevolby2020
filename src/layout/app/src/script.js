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

			this.$store.getters.getSource('obecne/strany', 'parties');
			this.$store.getters.getSource('volby/kv/2020/list', 'callout');

			window.addEventListener('resize', () => this.resize());
			setTimeout(() => {
				this.resize();
			}, 1000);
			this.resize();
    },
    watch: {
    }
};
