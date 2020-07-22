export default {
	name: 'quiz-captcha',
	props: ['captcha', 'tick', 'question'],
	data: function () {
		return {}
	},
	computed: {
		buttons: function () {

			var list = [];

			if (this.question) {

				this.question.split('').forEach((val, index) => {
					if (index % 3 === 0 && index < 25) {

						var img = 'circle';

						if (val.toUpperCase() != val) {
							img = ['square', 'triangle', 'star'][Math.floor(Math.random()*3)]
						}

						list.push({
							copy: val.toUpperCase() === val ? 'X' : ['A', 'O', 'Z', 'L'][Math.floor(Math.random()*4)],
							img
						})
					}
				});
			}

			return list;
		}
	},
	methods: {
		handle_click: function (index) {
			this.$emit('change', index);
		}
	},
	mounted: function () {}
};
