import { Core } from "./core.js";
import { createElement, loopComponent } from "./utility.js";
import { Reactivity } from "./reactivity.js";

// fungsi ini melakukan
// set props terhadap semua
// props yang di miliki
// component
function setProps(child,props,value){

	if(child.props.hasOwnProperty(props)) child.props[props] = value;

	if(child.children.length > 0) for(let x of child.children){

		setProps(x,props,value);

	}

}

// fungsi ini berfungsi untuk
// mengupdate semua child ketika
// props berubah
function updateChild(child){

	child.update();

	if(child.children.length > 0) for(let x of child.children){

		updateChild(x);

	}

}

function desrtoyChild(child){

	child.element.remove();

	if(child.children.length > 0){

		for(let x of child.children) desrtoyChild(x);

	}

}

// class component
// merupakan class yang berfungsi untuk
// membuat instance dari component
// dan membentuk fragment yang merupakan
// bentukan DOM TREE 
export class Component extends Core{

	constructor(){

		super();

		// mengset fragment dan context
		this.fragment = {};
		this.context = {};

	}


	// fungsi create merupakan
	// fungsi yang membuat parent (ROOT)
	// dari suatu component
	// dan mengembalikan 
	// nilai reaktif yang di set dengan setter dan getter
	create(name,inner){

		this.fragment = {
			...this.fragment,
			...createElement(name,inner)
		}

		this.context = {
			...this.context,
			...this.fragment.props
		}


		const fragment = this.fragment;

		return new Reactivity(this.context).create({

			eventSetter(args){

				if(args[0].hasOwnProperty(args[1])){

					setProps(fragment,args[1],args[2]);
					updateChild(fragment);

				}else{

					console.warn("props not found!");

				}

			},
			eventGetter(args){

				return args[0][args[1]];
				
			}
		})

	}

	// fungsi untuk membuat raw data anak dan component anak
	createChild(name,inner){

		let child = createElement(name,inner);
		
		this.context = {
			...this.context,
			...child.props
		}

		return {
			...child,
			type: "ChildComponent"
		};

	}

	// fungsi untuk membuat looping component
	createLoop(name,inner){

		let element = loopComponent(name,inner,this.rootElement);

		this.context = {
			...this.context,
			...element.props
		}

		return {
			...element,
			type: "LoopComponent"
		};

	}

	// fungsi untuk menyusun component
	// dari bentuk DOM TREE ke dalam 
	// bentuk real DOM TREE
	rootElement(child,parent){

		parent.appendChild(child.element);

		if(child.children.length > 0){

			for(let x of child.children) this?.rootElement(x,child.element);

		}


	}

	// fungsi untuk melakukan render
	render(target){

		for(let x of this.fragment.children){

			this.rootElement(x,this.fragment.element);

		}

		target.appendChild(this.fragment.element);

	}

	destroy(){

		desrtoyChild(this.fragment);

	}

}