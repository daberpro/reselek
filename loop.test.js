import {
	Component,
    SimpleComponent,
    setHead,
	registerComponentToClassArray,
	ComponentClass,
	find,
	getAllContextFrom,
	StyleSheet
} from "./core/component.js";


const app = new Component();

app.create("div",{
	inner: "",
	props: {},
	children: [
		app.createChild("h1",{
			inner: "hello world",
			props:{},
			attribute:{},
			"@id": "list"
		}),
		app.createLoop("ul",{

			inner: "hallo {{waktu}}",
			attribute: {
				id: "app"
			},
			child: app.createChild("li",{
				attribute:{

					id: "urutan-{{n}}"

				},
				inner:"{{x.nama}} umur {{x.umur}} index {{n}}",
				props: {
					x: null,
					n: null
				}
			}),
			loop: "x of list n",
			props: {
				list: [

				{
					nama: "ari",
					umur: 0
				},
				{
					nama: "gilang",
					umur: 0
				}

				],
				waktu: 1
			},
			"@id": "list"

		})

	]

});

app.render(document.body);

registerComponentToClassArray(app.fragment);

window.list = find("list").state

find("list").state.waktu += 1;

console.log(ComponentClass);