const {
	parse,
	parseFragment
} = require("parse5");

const {
	js: beautify
} = require("js-beautify")

function checkBinding(text_node){

	// melakukan pengecekan apakah terdapat {{}}
	// menggunakan regex
	let allBindingValue = text_node?.match(/\{{.*?\}}/igm);
	
	// kemudian melakukan filter agar tidak terjadi
	// duplikat value di dalam array allBindingValue
	allBindingValue = [...new Set(allBindingValue)];

	// variabel ini akan berfungsi untuk menyimpan semua bind value
	let value = {};

	// melakukan pengecekan apakah 
	// variabel allBindungValye merupakan array
	if(allBindingValue instanceof Array && allBindingValue.length !== 0){

		// melakukan perulangan dan megambil attribute
		for(let x of allBindingValue){

			// melakukan pengestan setiap value ke dalam variabel
			// value
			value = {
				...value,
				[x.replace(/\{{/igm,"").replace(/\}}/igm,"")] : x
			}

		}

		// mengembalikan status bahwa binding ada
		// dan mengembalikan nilai binding
		return {
			binding: true,
			value
		}

	}

	// jika binding tidak ada
	// maka kembalikan status binding kosong
	// dan mengembalikan binding
	return {
		binding: false,
		value
	}

}

function toString(b){

	let c = Object.keys(b).map(e =>{

		if(b[e] instanceof Array){
			return `${e}:[${b[e]}]` 
		}

		if(b[e] instanceof Object && typeof b[e] !== "function"){

			return `${e}:${toString(b[e])}`

		}

		if(typeof b[e] === "string") return `${e}:"${b[e]}"`;

		return `${e}:${b[e]}`

	});
	
	let g = "{";
	
	for(let x in c){

	    if(parseInt(x) === c.length-1){
	        
	        g+= c[x]+"}"
	        
	    }else{
	    
	        g+= c[x]+","
	    }
	}

	if(g === "{") return "{}"

	return g;

}

function createTemplate(child,first = false){

	let template;

	let attribute = {};

	for(let x of child?.attrs || []){

		for(let y in x){

			if(y === "name") attribute[x[y]] = x["value"]; 

		}

	}

	if(!(attribute.hasOwnProperty("props"))) attribute["props"] = "";

	if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop")){
		template = `
		@seleku_name.createLoop("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return attribute["props"].split(" ").map(e => `${e}: null`).join(",\n");

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			child: ${child?.childNodes?.map(e =>{

				return createTemplate(e);

			}).filter(e => e !== void 0) || []},
			loop: "${attribute["loop"]}"

		})`

	}
	else if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop") && attribute.hasOwnProperty("condition") || child.nodeName !== "#text" && attribute.hasOwnProperty("condition")) template = `
		@seleku_name.createCondition("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return attribute["props"].split(" ").map(e => `${e}: null`).join(",\n"); 

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e);

			}).filter(e => e !== void 0) || []}],
			condition: "${attribute["condition"]}"

		})`
	else if(child.nodeName !== "#text" && !first) template = `
		@seleku_name.createChild("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return attribute["props"].split(" ").map(e => `${e}: null`).join(",\n"); 

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e);

			}).filter(e => e !== void 0) || []}]

		})`
	else if(child.nodeName !== "#text") template = `@seleku_name.create("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return attribute["props"].split(" ").map(e => `${e}: null`).join(",\n");

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e);

			}).filter(e => e !== void 0) || []}]

		});\n\n`

	return template;
}

class SelekuCompiler{

	constructor(filename = "App"){

		this.config = {
			filename
		};

	}

	compile(sourceCode){

		const fragment = parseFragment(sourceCode);

		let firstTemplate = null;
		let CSS = "";
		let JS = `import { Component } from "seleku/core"

		const @seleku_name = new Component();`;

		for(let x of fragment.childNodes){

			if(x.hasOwnProperty("tagName") && 
			(x.tagName !== "script") && 
			(x.tagName !== "style") && 
			(firstTemplate === null)){
				
				JS += createTemplate(x,true);
			
			}else if(x.hasOwnProperty("tagName") && x.tagName === "script"){

				JS += x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("");

			}else if(x.hasOwnProperty("tagName") && x.tagName === "style"){

				CSS = x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("");

			}
			
		}

		JS = JS.replaceAll("@seleku_name",this.config.filename);

		return {
			JS,
			CSS
		};
	}

}

module.exports = {SelekuCompiler};

// let compiler = new SelekuCompiler();

// let a = compiler.compile(`

// 	<style>

// 		h1{
// 			color: white;
// 		}

// 	</style>

// 	<h1 id="app" class="v-d-flex v-text-center" props="nama umur">
		
// 		hello world {{nama}} {{umur}}

// 		<ul loop="x of list" props="list">

// 			<li props="x y" condition="y">
				
// 				{{x}}

// 				<span> dan {{y}}</span>

// 			</li>

// 		</ul>

// 	</h1>

// 	<script>

// 		console.log("hello world");

// 	</script>

// `);


// console.log(beautify(a.JS, { indent_size: 2, space_in_empty_paren: true }))