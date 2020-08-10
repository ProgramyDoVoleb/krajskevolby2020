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
		betterURL,
		hashMe: function(str) {
	    var hash = 0, i, chr;
	    for (i = 0; i < str.length; i++) {
	      chr   = str.charCodeAt(i);
	      hash  = ((hash << 5) - hash) + chr;
	      hash |= 0; // Convert to 32bit integer
	    }
	    return 'pdv' + hash;
	  },
		copy: function (q) {
		  const el = document.createElement('textarea');
		  el.value = document.querySelector(q).innerText;
		  document.body.appendChild(el);
		  el.select();
		  document.execCommand('copy');
		  // document.body.removeChild(el);
		}
	}
};
