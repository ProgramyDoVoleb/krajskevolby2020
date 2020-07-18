// import LogoItem from '@/components/logo-item/do';
import PartyList from '@/components/party-list/do';
import PersonAbout from "@/components/person-about/do";
import UpdateForm from "@/components/update-form/do";

import {PDV} from '@/common/helpers'

export default {
	name: 'overview',
	data: function () {
		return {}
	},
  components: {
		// LogoItem,
		PersonAbout,
		PartyList,
		UpdateForm
	},
	methods: {
		showJSON: function (e) {

			var json = {};

			var win = window.open();

			win.document.write('<iframe src="' + Buffer.from(JSON.stringify(json)).toString("base64") + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');

			window.open("data:text/json," + encodeURIComponent(JSON.stringify(json)), "_blank")
		},
		ge: function () {
			this.$store.dispatch("ge", {
				action: "download",
				category: "opendata",
				label: this.$route.fullPath
			});
		}
	},
	computed: {
		regions: function () {
			 return this.$store.state.static.regions;
		},
		parties: function () {
			return this.$store.getters.parties();
		},
		generateJSON: function () {

			var json = {
				generovano: new Date(),
				zdroj: "https://krajskevolby2020.programydovoleb.cz",
				licence: 'Uvádějte u zobrazených dat viditelný a funkční odkaz na zdroj + název projektu: Programy do voleb',
				prohlaseni: 'Autor projektu Programy do voleb nenese žádnou zodpovědnost za správnost a úplnost dat. Jejich použití je na vlastní riziko a optimálně byste si je měli před použitím prověřit.',
				data: {
					regions: []
				}
			};

			this.regions.forEach((region, i) => {
				var r = {
					jmeno: region.name,
					zkratka: region.short,
					odkaz: json.zdroj + '/' + region.hash,
					strany: []
				}

				this.$store.getters.candidatesInRegion(region.hash).forEach((cand, i) => {
					var obj = {};

					obj.jmeno = cand.name;
					obj.zkratka = cand.short;

					obj.odkaz = json.zdroj + cand.link;
					obj.id = cand.hash;

					if (cand.logo) obj.logo = cand.logo;

					if (cand.coalition) {
						var c = [];

						cand.coalition.forEach(member => {
								c.push({
									id: member.reg,
									jmeno: member.name,
									zkratka: member.short,
									logo: "https://data.programydovoleb.cz" + member.logo,
									odkaz: json.zdroj + '/rejstrik/' + member.hash
								});
						});

						obj.koalice = c;
					}

					if (cand.support) {
						var c = [];

						cand.support.forEach(member => {
								c.push({
									id: member.reg,
									jmeno: member.name,
									zkratka: member.short,
									logo: "https://data.programydovoleb.cz" + member.logo,
									odkaz: json.zdroj + '/rejstrik/' + member.hash
								});
						});

						obj.podpora = c;
					}

					if (cand.leader) {
						var c = {
							jmeno: cand.leader.name
						}

						if (cand.leader.party) c.clen = {
							id: cand.leader.party.reg,
							jmeno: cand.leader.party.name,
							zkratka: cand.leader.party.short,
							logo: "https://data.programydovoleb.cz" + cand.leader.party.logo,
							odkaz: json.zdroj + '/rejstrik/' + cand.leader.party.hash
						};

						// odkazy
						var linksLeader = [];

						if (cand.leader.links) {
							cand.leader.links.forEach(link => {
								var o = {};

								o[link.icon.name] = link.link;

								if (link.icon.type === 'email') {
									obj.email = link.link.split('mailto:')[1];
								} else {
									linksLeader.push(o);
								}
							});
						}

						if (linksLeader.length > 0) c.odkazy = linksLeader;

						obj.lidr = c;
					}

					if (cand.list) {
						obj.lide = cand.list.length;
					}

					// odkazy
					var links = [];

					if (cand.links) {
						cand.links.forEach(link => {
							var o = {};

							o[link.icon.name] = link.link;

							if (link.icon.type === 'email') {
								obj.email = link.link.split('mailto:')[1];
							} else {
								links.push(o);
							}
						});
					}

					if (links.length > 0) obj.odkazy = links;

					if (cand.program) obj.program = {
						original: cand.program,
						standardizovany: json.zdroj + cand.link + '/volebni-program'
					}
					r.strany.push(obj);
				});

				json.data.regions.push(r);
			});

			return "data:text/json," + encodeURIComponent(JSON.stringify(json));
		}
	},
	mounted: function () {
			this.$store.dispatch("ga", {title: "Velký přehled"});
			window.scrollTo(0, 0);
	}
};
