import ProgramBlock from '@/components/program-block/do';

export default {
	name: 'program-view',
	props: ['data', 'showIndex', 'showFloatingIndex'],
	components: {
		ProgramBlock
	},
	methods: {
		setBlockActiveVariable: function (position) {
			this.$refs['block'].forEach((ref, index) => {
				if (position > ref.$el.offsetTop - window.innerHeight + 200 && position < ref.$el.offsetTop + ref.$el.clientHeight + 200) {
					this.$refs['bullet'][index].classList.add("active");
				} else {
					this.$refs['bullet'][index].classList.remove("active");
				}
			});
		}
	},
	mounted: function () {

		window.addEventListener("resize", (e) => this.setBlockActiveVariable(window.scrollY));

		let last_known_scroll_position = 0;
		var ticking = false;

		window.addEventListener('scroll', (e) => {
		  last_known_scroll_position = window.scrollY;

		  if (!ticking) {
		    window.requestAnimationFrame(() => {
		      this.setBlockActiveVariable(last_known_scroll_position);
		      ticking = false;
		    });

		    ticking = true;
		  }
		});
	}
};
