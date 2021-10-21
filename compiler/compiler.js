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

function createTemplateFromImportComponent(child,first = false,importComponent){

	let template;

	let attribute = {};

	for(let x of child?.attrs || []){

		for(let y in x){

			if(y === "name") attribute[x[y]] = x["value"]; 

		}

	}


	if(!(attribute.hasOwnProperty("props"))) attribute["props"] = null;

	if(Object.keys(importComponent).join(" ").indexOf(child.tagName) !== -1){

		template = `@seleku_name.importComponent(${child.tagName},{${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}})`

	}
	else if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop")){
		template = `
		@seleku_name.createLoop("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			child: ${child?.childNodes?.map(e =>{

				return createTemplateFromImportComponent(e,false,importComponent);

			}).filter(e => e !== void 0) || []},
			loop: "${attribute["loop"]}",
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`

	}
	else if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop") && attribute.hasOwnProperty("condition") || child.nodeName !== "#text" && attribute.hasOwnProperty("condition")) template = `
		@seleku_name.createCondition("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplateFromImportComponent(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			condition: "${attribute["condition"]}",
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`
	else if(child.nodeName !== "#text" && !first) template = `
		@seleku_name.createChild("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplateFromImportComponent(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`
	else if(child.nodeName !== "#text") template = `@seleku_name.createChild("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplateFromImportComponent(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null}

		},true);\n\n`

	return template;
}

function createTemplate(child,first = false,importComponent){

	let template;

	let attribute = {};

	for(let x of child?.attrs || []){

		for(let y in x){

			if(y === "name") attribute[x[y]] = x["value"]; 

		}

	}

	if(!(attribute.hasOwnProperty("props"))) attribute["props"] = null;

	if(Object.keys(importComponent).join(" ").indexOf(child.tagName) !== -1){

		template = `@seleku_name.importComponent(${child.tagName},{${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
		"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}})`

	}
	else if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop")){
		template = `
		@seleku_name.createLoop("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			child: ${child?.childNodes?.map(e =>{

				return createTemplate(e,false,importComponent);

			}).filter(e => e !== void 0) || []},
			loop: "${attribute["loop"]}",
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`

	}
	else if(child.nodeName !== "#text" && attribute.hasOwnProperty("loop") && attribute.hasOwnProperty("condition") || child.nodeName !== "#text" && attribute.hasOwnProperty("condition")) template = `
		@seleku_name.createCondition("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			condition: "${attribute["condition"]}",
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`
	else if(child.nodeName !== "#text" && !first) template = `
		@seleku_name.createChild("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},
			"inherit:props":{${attribute["inherit:props"]?.split(" ").map(e => `"${e}":null`) || ""}}

		})`
	else if(child.nodeName !== "#text") template = `@seleku_name.create("${child.tagName}",{

			inner: "${child?.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value.replace(/(\n|\t)/igm,"")).join("")}",
			props: {${(()=>{

				return (attribute["props"] !== null && typeof attribute["props"] === "string")? attribute["props"].split(" ").filter(e => e.replace(/\s+/igm,"").length > 0 && !(/:/igm.test(e))).map(e => `${e}: null,`).join(" ,\n") : "";

			})()}},
			attribute: ${toString((()=>{

				let obj = {};

				for(let x in attribute){

					if(x !== "loop" && x !== "props" && x !== "condition" && x !== "@id" && x  !== "inherit:props") obj = {...obj,[x]: attribute[x]}

				}

				return obj;

			})())},
			children: [${child?.childNodes?.map(e =>{

				return createTemplate(e,false,importComponent);

			}).filter(e => e !== void 0) || []}],
			"@id": ${attribute.hasOwnProperty("@id")? "\""+attribute["@id"]+"\"" : null},


		});\n\n`

	return template;
}

class SelekuCompiler{

	constructor(args = {filename:"unknown",precompile(){return void 0}}){

		this.config = {
			...args
		};

	}

	compileImportComponent(sourceCode){
		
		const fragment = parseFragment(sourceCode);
		let stringStatement = "";

		const allStatement = {
			"#import"(args){

				stringStatement += args.join(" ").replace(/\#/igm,"");

			}
		};

		let statement = [];
		let componentImport = {};

		for(let x of fragment.childNodes){

			if(x.nodeName === "#text"){

				statement = x.value.replace(/(\n|\r|\t)/igm,"").replace(/\#/igm," #").split(" ").filter(e => e.length > 0);

				if(/\{.*?\}/igm.test(x.value.replace(/(\n|\r|\t)/igm,""))){

					for(let x_ of x.value.replace(/(\n|\r|\t)/igm,"").replace(/\#/igm," #").match(/\{.*?\}/igm)){

						componentImport = {
							...componentImport,
							[x_.replaceAll("{","").replaceAll("}","").replace(/\s+/igm,"")]: x_
						}

					}

				}

				if(statement[0] in allStatement){

					allStatement[statement[0]](statement);


				}


			}

		}

		let firstTemplate = null;
		let CSS = "";
		let JS = `import {Component,registerComponentToClassArray,ComponentClass,find,getAllContextFrom,StyleSheet} from "@selekudev/core"
		${stringStatement}
		const @seleku_name = new Component();`;

		for(let x of fragment.childNodes){

			if(x.hasOwnProperty("tagName") && 
			(x.tagName !== "script") && 
			(x.tagName !== "style") && 
			(firstTemplate === null)){
				
				JS += createTemplateFromImportComponent(x,true,componentImport);
			
			}else if(x.hasOwnProperty("tagName") && x.tagName === "script"){

				JS += this.config.precompile({
					type: "JS",
					element: x,
					data: x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("")
				}) || x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("");

			}else if(x.hasOwnProperty("tagName") && x.tagName === "style"){

				CSS = this.config.precompile({
					type: "CSS",
					element: x,
					data: x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("")
				}) || x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("");

			}
			
		}

		JS += `
		export { @seleku_name }
		`

		JS = JS.replaceAll("@seleku_name",this.config.filename);

		return {
			JS: beautify(JS, { indent_size: 2, space_in_empty_paren: true }),
			CSS
		};

	}

	compile(sourceCode){

		const fragment = parseFragment(sourceCode);
		let stringStatement = "";

		const allStatement = {
			"#import"(args){

				stringStatement += args.join(" ").replace(/\#/igm,"");

			}
		};

		let statement = [];
		let componentImport = {};

		for(let x of fragment.childNodes){

			if(x.nodeName === "#text"){

				statement = x.value.replace(/(\n|\r|\t)/igm,"").replace(/\#/igm," #").split(" ").filter(e => e.length > 0);

				if(/\{.*?\}/igm.test(x.value.replace(/(\n|\r|\t)/igm,""))){

					for(let x_ of x.value.replace(/(\n|\r|\t)/igm,"").replace(/\#/igm," #").match(/\{.*?\}/igm)){

						componentImport = {
							...componentImport,
							[x_.replaceAll("{","").replaceAll("}","").replace(/\s+/igm,"")]: x_
						}

					}

				}

				if(statement[0] in allStatement){

					allStatement[statement[0]](statement);


				}


			}

		}

		let firstTemplate = null;
		let CSS = "";
		let JS = `import {Component,registerComponentToClassArray,ComponentClass,find,getAllContextFrom,StyleSheet} from "@selekudev/core"
		${stringStatement}
		const @seleku_name = new Component();`;

		for(let x of fragment.childNodes){

			if(x.hasOwnProperty("tagName") && 
			(x.tagName !== "script") && 
			(x.tagName !== "style") && 
			(firstTemplate === null)){
				
				JS += createTemplate(x,true,componentImport);
				JS += `registerComponentToClassArray(@seleku_name.fragment);`
			
			}else if(x.hasOwnProperty("tagName") && x.tagName === "script"){

				JS += this.config.precompile({
					type: "JS",
					element: x,
					data: x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("")
				}) || x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("");

			}else if(x.hasOwnProperty("tagName") && x.tagName === "style"){

				CSS = this.config.precompile({
					type: "CSS",
					element: x,
					data: x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("")
				}) || x.childNodes?.filter(e => e.nodeName === "#text" && e.value.length > 0).map( e => e.value).join("");

			}
			
		}

		JS += `
		export default @seleku_name
		`

		JS = JS.replaceAll("@seleku_name",this.config.filename);

		return {
			JS: beautify(JS, { indent_size: 2, space_in_empty_paren: true }),
			CSS
		};
	}

}

module.exports = {SelekuCompiler};
// let compiler = new SelekuCompiler({
// 	filename: "App",
// 	precompile(args){

// 		if(args.type === 'CSS'){

// 			return args.data.replaceAll(/\$primary/igm,"salmon");

// 		}

// 	}
// });

// let a = compiler.compileImportComponent(`

// 	#import { 
		
// 		card 

// 	} from "./card.selekux"

// 	#import { 
// 		modal,
// 		finding
// 	} from "./modal.js"

// 	<style>

// 		h1{
// 			color: $primary;
// 		}

// 	</style>

// 	<h1 @id="h1" id="app" class="v-d-flex v-text-center">
		
// 		<card @id="card 1"></card>
// 		<finding @id="card 2" props="title"></finding>

// 		<p @id="p1" inherit:props="nama">

// 			hello

// 		</p>

// 	</h1>

// 	<script>

// 		// hallo
// 		find("card 1").state.title = "hello world";

// 	</script>

// `);

// console.log(a.CSS);
// console.log(a.JS);