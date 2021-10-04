import { Component } from "./core/component.js";

// [1 - 0]
const App = new Component();

const Main = App.create("div",{
	// [1 - 4]
	// [1 - 4 - 0]
	// [1 - 4 - 1]
	// [1 - 4 - 2]
	// [1 - 4 - 3]
	// [1 - 4 - 4]
	inner:`hello {{list[0]}} {{sum(nama)}} {{nama}} {{umur}} {{user.nama.depan}} {{()=>(

		"haha "+nama

	)}}`,
	children: [
		App.createChild("h1",{
			inner: "hello {{nama}}",
			props: {
				nama: "andi"
			},
			children: [
				App.createChild("span"," 100")
			]
		}),
		App.createChild("h2","hello world"),
		App.createLoop("ul",{

			inner: `hallo`,
			child: App.createChild("li",{
				inner: `nama user {{x.nama}}`,
				props: {
					x: null
				},
				children:[
					App.createChild("b",{
						inner: " hello {{juk()}}",
						children:[
							App.createChild("span"," world"),
							App.createLoop("h1",{
								loop: "x of y",
								props: {
									y: [1,2,3,4]
								},
								inner:"",
								child: App.createChild("p",{
									props:{
										x: null
									},
									inner: `{{x}}`
								})
							})
						],
						props:{
							juk: ()=>{

								return "awokawoak"

							}
						}
					})
				]
			}),
			props:{

				num: [{
					nama: "gilang"
				},{
					nama: "budi"
				}]

			},
			loop: "x of num"

		})
	],
	// [1 - 2]
	props: {
		// [1 - 3]
		nama: "andi", //[1 - 3 - 3] 
		umur: 19, //[1 - 3 - 4]
		user:{ //[1 - 3 - 1]
			nama: {
				depan: "gilang"
			}
		},
		sum: (nama)=>{ //[1 - 3 - 0]

			return nama + " ganteng"

		},
		list: [1,2,3] //[1 - 3 - 2]
	}
});

// [1 - 1]
App.render(document.body);

// [1 - 5]
Main.umur = 100;

Main.num = [{nama: "daber"},{nama: "mark"}]