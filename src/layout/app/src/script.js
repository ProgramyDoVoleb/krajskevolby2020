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
    },
    mounted: function () {
			this.$store.dispatch('fetchRada');
			this.$store.dispatch('fetchCallout');
			this.$store.dispatch('fetchParties');
    },
    watch: {
    }
};
