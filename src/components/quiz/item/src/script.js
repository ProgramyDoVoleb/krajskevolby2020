export default {
	name: 'quiz-item',
	props: ['content', 'imgDefault', 'imgSelected', 'selected', 'value', 'type'],
	data: function () {
		return {}
	},
	computed: {
		img: function () {
			return this.selected === true ? this.sel : this.def;
		},
		def: function () {
			return this.imgDefault || '/static/icon/icon-none.svg'
		},
		sel: function () {
			return this.imgSelected || '/static/icon/icon-check.svg'
		}
	},
	methods: {
		handle_click: function () {
			this.$emit('click', {});
		}
	},
	mounted: function () {}
};
