import axios from "axios";
import RegionMenu from "@/components/region-menu/do";



export default {
	name: 'app',
    data: function () {
      return {
        search: '',
        menuVisible: false,
        current: new Date().getTime(),
        start: 1558648800000
      }
    },
    components: {
      RegionMenu
    },
    computed: {
      showDate: function () {
        var rem = new Date(this.start - this.current);

        if (this.current > this.start) {
          return "Výsledky v neděli po 23:00";
        } else {
          if (rem.getDate() > 10) {
            return "24. a 25. května 2019";
          } else if (rem.getDate() > 4) {
            return "volby jsou za " + rem.getDate() + " dnů"
          } else if (rem.getDate() > 1) {
            return "již za " + rem.getDate() + " dny jdeme volit"
          } else if (rem.getDate() > 0) {
            return "v pátek od 14:00"
          } else {
            return "volit lze do soboty 14:00"
          }
        }

      }
    },
    methods: {
      toggleMenu: function (state, to) {

        if (to) {
          this.$router.push({path: to});
        }

        if (state) {
          this.menuVisible = state;
        } else {
          this.menuVisible = !this.menuVisible;
        }
      }
    },
    mounted: function () {
      setInterval(() => this.current = new Date().getTime(), 1000);
    },
    watch: {
    }
};
