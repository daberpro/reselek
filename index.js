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

import {

	AtomicComponent

} from "./core/experimental/atomicComponent.js"

let card = new Component();
  card.createChild("h1", {
    inner: "hello {{nama}}",
    props: {
      nama: ""
    },
    children: [
      card.createChild("small", {
        inner: " by seleku ",
        attribute: {
          style: `font-size: 12px;`
        }
      })
    ]
  }, true);

const app = new Component();

app.create("div", {
    inner: "",
    props: {
    	version: "1.56.7"
    },
    attribute: {
      class: "container"
    },
    children: [
      app.createChild("h1", {
        inner: "hallo {{pesan}}",
        props: {
          pesan: null
        },
        "inherit:props":{

	    	version: "1.13.4"

	    },
        attribute: {
          class: "title"
        },
        children: [],
        "@id": "h1"
      }),
      app.importComponent(card, {
        nama: null,
        "@id": "kl"
      }),
      app.createChild("p", {
        inner: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptates.",
        props: {
        	simpleMessage: null
        },
        attribute: {},
        children: [

        	app.createChild("small",{

        		props: {

        		},
        		inner:"{{simpleMessage}}",
        		"inherit:props":{
        			simpleMessage: null
        		},
        		children:[

        			app.createChild("small",{

		        		props: {

		        		},
		        		inner:"{{simpleMessage}}",
		        		"inherit:props":{
		        			simpleMessage: null
		        		}

		        	})

        		],
        		"@id": null

        	})

        ],
        "@id": "myp"
      }),
      app.createChild("h1", {
        inner: "{{count}}",
        props: {
          count: null,
          a: null
        },
        attribute: {},
        children: [],
        "@id": "show-count"
      }),
      app.createChild("button", {
        inner: "click me",
        props: {},
        attribute: {},
        children: [],
        "@id": "mybtn",
        event:{

          onclick: ()=>{

          }

        }
      }),
      app.createLoop("ul",{
        loop: 'nama of gk',
        props:{
          gk: null
        },
        inner: "",
        "inherit:props": {
          nama: null
        },
        attribute: {
          id:"test"
        },
        child: app.importComponent(card,{
          props:{

            nama: null

          }
        }),
        "@id": "kjg"
      }),
      app.createLoop("ul", {
        inner: "list of seleku developer",
        props: {
          list: null,
          namaku: 100,
        },
        attribute: {
          class: "list"
        },
        child: app.createChild("li", {
          inner: "{{x}} {{namaku}}",
          props: {
            x: null,
            click: null,
            showme: false
          },
          "inherit:props":{
          	namaku: null
          },
          event:{
          	onclick: ()=>{

          		console.log(0)

          	}
          },
          attribute: {
            class: "list-item"
          },
          children: [

      			app.createChild("h1",{
      				inner: "hallo {{bn}} {{namaku}}",
      				"inherit:props":{
      					namaku: null
      				},
      				props:{
      					bn: "guys"
      				}
      			}),
            app.createCondition("h3",{

              inner: "i will show",
              props:{
                showi: null
              },
              children: [

                app.createChild("p",{
                  inner: "hello"
                })

              ],
              condition: "showi",
              "@id": "shg"

            }),
            app.createLoop("b",{
              inner: "nested loop",
              child: app.createChild("p",{

                inner: "hello i am {{user}}",
                "inherit:props":{
                  user: null
                },
                props:{
                  user: null
                }

              }),
              "inherit:props":{
                user: null
              },
              props: {
                list2: null,
                user: null
              },
              "@id": "nest",
              loop: "c of list2"
            })          	

          ],
          "@id": "po"
        }),
        loop: "x of list",
        "@id": "dev-list"
      })
    ],
    "@id": "bhy"
  });
registerComponentToClassArray(app.fragment);
app.render(document.body);

// App.state.title = "ari"

// console.log(card)

window.app = app;

find("h1").state.pesan = "apa kabar";

find("kl").state.nama = "user";

window.myp = find("myp");

let seleku_developer = ["daber", "ari", "abdul"];

find("dev-list").state.list = seleku_developer;
// registerComponentToClassArray(app.fragment);
window.p = find("dev-list")

find("dev-list").state.click = () => {

  return 1 + 2;

};


find("mybtn").event.onclick = ()=>{

  console.log(100)

}

registerComponentToClassArray(app.fragment);
window.nest = find("nest");
window.shg = find("shg");

find("kjg").state.gk = ["ari","andi"]

// window.crd1 = find("card 1");

// const Atomic = new AtomicComponent();

// let p = Atomic.createEmptyElement("p",{
// 	inner: "create by daber"
// });

// let h1 = Atomic.createAtomicFrom(App.createCondition("h1",{
// 	condition: "show",
// 	props:{
// 		show: false
// 	},
// 	inner: "hello",
// 	attribute: {
// 		id: "card"
// 	}
// }));
// h1.freeProps(["condition"]);


StyleSheet(`html,body{margin: 0px;padding: 0px;width: 100%;height:  100%;background: rgb(245,245,255);}.title{font-size:12px;}body{display: flex;justify-content: flex-start;align-items: center;flex-direction: column;}.list{padding: 20px;display: flex;justify-content: center;align-items: center;flex-direction: column;font-size: 1.5rem;}.list-item{width: 300px;margin-top: 30px;font-size: 1rem;height: auto;background: rgb(240,240,255);border-radius: 5px;padding: 20px;list-style:  none;display: flex;justify-content: center;align-items: center;flex-direction: column;}*{font-family: sans-serif;font-weight: 300;box-sizing: border-box;}.container{width: 400px;height: auto;box-shadow: 0px 2px 3px rgba(0,0,0,0.1);background: white;padding: 20px;}`);


// console.log(p);


