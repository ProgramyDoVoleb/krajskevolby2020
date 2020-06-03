import ProgramBlock from '@/components/program-block/do';

export default {
	name: 'program-element',
	props: ['source', 'local', 'hash'],
	components: {
		ProgramBlock
	},
	computed: {
		data: function () {
			return this.$store.getters.getSource('volby/kv/2020/program/' + this.local);
		}
	}
};
