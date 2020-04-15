var viewBox = {
	CZ010: '300 180 100 100',
	CZ020: '100 80 500 300',
	CZ031: '100 300 500 300',
	CZ032: '0 200 250 300',
	CZ041: '-50 120 300 150',
	CZ042: '0 0 500 200',
	CZ051: '300 10 300 100',
	CZ052: '400 80 350 150',
	CZ053: '450 200 300 150',
	CZ063: '350 290 400 200',
	CZ064: '500 350 400 200',
	CZ071: '500 130 500 300',
	CZ072: '700 385 300 100',
	CZ080: '650 180 400 200'
}

export default {
	name: 'map-element',
	props: ['highlight', 'points', 'areas', 'width', 'zoom', 'clickable'],
	data: function () {
		return {
			e: 18.8591456,
			s: 48.5519972,
			w: 12.0906633,
			n: 51.0556997,
			h: 18.8591456 - 12.0906633,
			v: 51.0556997 - 48.5519972,
			widthValue: 0,
			heightValue: 0,
			zoomValue: 'CZ01',
			lastEmit: {
				time: 0,
				data: undefined
			}
		}
	},
	computed: {
		viewBox: function () {
			return (viewBox[this.zoomValue] || viewBox[this.zoomValue.substring(0, 5)]) || '-50 -50 1100 680';
		},
		calculatedPoints: function () {
			var list = [];

			if (this.points) {
				this.points.forEach(point => {
					var obj = {
						e: 0,
						n: 0,
						x: 0,
						y: 0
					}

					obj.e = (point.lng - this.w) / this.h;
					obj.n = (point.lnt - this.s) / this.v;

					obj.x = 0 + obj.e * 1021;
					obj.y = 587 - (0 + obj.n * 587);

					obj.fill = point.color;
					obj.opacity = point.opacity || 1;
					obj.r = point.size || 10;

					obj.num = point.num;

					list.push(obj);
				});
			}

			return list;
		}
	},
	methods: {
		clear: function () {
			if (this.$refs) {
				Object.keys(this.$refs).forEach(ref => {
					this.$refs[ref].classList.remove('highlight');
					this.$refs[ref].style = "";
					this.$refs[ref].removeEventListener('mouseover', function () {});
					this.$refs[ref].removeEventListener('mouseout', function () {});
					this.$refs[ref].removeEventListener('click', function () {});
				})
			}
		},
		populate: function () {
			this.clear();

			if (this.highlight) {
				this.$refs[this.highlight].classList.add('highlight');
			}
			if (!this.highlight && this.zoomValue.length > 4) {
				this.$refs[this.zoomValue].classList.add('highlight');
			}
			if (this.areas) {
				this.areas.forEach(area => {
					if (this.$refs[area.nuts] && area.color && area.opacity) {
						this.$refs[area.nuts].style = 'fill:' + area.color + ';opacity:' + area.opacity;

						this.$refs[area.nuts].title = area.value;

						this.$refs[area.nuts].addEventListener('mouseover', (e) => this.focus(this.$refs[area.nuts], e, area));
					} else {
						console.log(area);
					}
				});
			}
			if (this.clickable) {
				this.clickable.forEach(area => {
					if (this.$refs[area]) {
						if (!this.areas) this.$refs[area].style = 'fill: #ffffff;';
						this.$refs[area].classList.add("hoverable");
						this.$refs[area].addEventListener('click', (e) => this.select(area, e));
						if (!this.areas) this.$refs[area].addEventListener('mouseover', (e) => this.focus(this.$refs[area], e, area));
						this.$refs[area].addEventListener('mouseout', (e) => this.blur(this.$refs[area], e));
					} else {
						console.log(area);
					}
				});
			}
		},
		resize: function () {
			this.widthValue = this.width || 256;
			this.heightValue = Math.round(this.widthValue / 256 * 149);
		},
		focus: function (data, e, area) {
			data.classList.add(this.areas ? "hover-opacity" : "hover");
			this.$emit('hover', {data, e, area});
		},
		blur: function (data, e) {
			data.classList.remove(this.areas ? "hover-opacity" : "hover");
			this.$emit('out', {data, e});
		},
		select: function (data, e, area) {
			this.$emit('select', {data, e, area});
		},
		selectPoint: function (e) {
			this.select({id: Number(e.target.attributes.point.value)}, e);
		}
	},
	mounted: function () {

		this.zoomValue = this.zoom || 'CZ01';

		this.populate();
		this.resize();

		window.addEventListener("resize", () => this.resize());

		setTimeout(() => this.resize(), 100);
		setTimeout(() => this.resize(), 1000);
		setTimeout(() => this.resize(), 2500);
	},
	watch: {
		points: function () {
			this.populate();
		},
		highlight: function () {
			this.populate();
		},
		areas: function () {
			this.populate();
		},
		zoom: function () {
			this.zoomValue = this.zoom || 'CZ01';
		}
	}
};
