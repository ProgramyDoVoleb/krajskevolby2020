import {stripURLintoDomain} from "@/common/helpers";

export default {
	name: 'copyright',
	props: ['data'],
	data: function () {
		return {}
	},
	computed: {
		copy: function () {

			var s = this.data && this.data.copyright ? this.data.copyright.content : 'Fotografie, citace a vizitky kandidátů pochází z jejich webových stránek či stránek hnutí, stran či koalic.';

			var list = [];
			var remain;

			for (var i = 9; i > -1; i--) {
				var parts = s.split("%" + i);

				if (parts.length > 1) list.push(parts[1]);

				remain = parts[0];
			}

			list.push(remain);

			list = list.reverse();

			return {
				content: list,
				vars: this.data && this.data.copyright ? this.data.copyright.vars : []
			};
		}
	},
	methods: {
		stripURLintoDomain
	}
};
