import { Core } from "./core.js";
import { 

	createElement,
	loopComponent,
	conditionalComponent,
	desrtoyChild

} from "./utility.js";

import { Reactivity } from "./reactivity.js";

// fungsi ini melakukan
// set props terhadap semua
// props yang di miliki
// component
function setProps(child,props,value){

	if(child.props[props] !== void 0) child.props[props] = value;

	updateChild(child);

	if(child.children.length > 0) for(let x of child.children){

		setProps(x,props,value);

	}

	if(child.hasOwnProperty("child") && child.child.children.length > 0) for(let x of child.child.children){

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
		this.state = {};

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

		this.state = new Reactivity(this.context).create({

			eventSetter(args){

				if(args[0].hasOwnProperty(args[1])){

					setProps(fragment,args[1],args[2]);

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

		const fragment = this.fragment;

		this.state = new Reactivity(this.context).create({

			eventSetter(args){

				if(args[0].hasOwnProperty(args[1])){

					setProps(fragment,args[1],args[2]);

				}else{

					console.warn("props not found!");

				}

			},
			eventGetter(args){

				return args[0][args[1]];
				
			}
		})

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

		const fragment = this.fragment;

		this.state = new Reactivity(this.context).create({

			eventSetter(args){

				if(args[0].hasOwnProperty(args[1])){

					setProps(fragment,args[1],args[2]);

					

				}else{

					console.warn("props not found!");

				}

			},
			eventGetter(args){

				return args[0][args[1]];
				
			}
		});

		return {
			...element,
			type: "LoopComponent"
		};

	}

	createCondition(name,inner){

		let element = conditionalComponent(name,inner);

		this.context = {
			...this.context,
			...element.props
		}

		const fragment = this.fragment;

		this.state = new Reactivity(this.context).create({

			eventSetter(args){

				if(args[0].hasOwnProperty(args[1])){

					setProps(fragment,args[1],args[2]);

				}else{

					console.warn("props not found!");

				}

			},
			eventGetter(args){

				return args[0][args[1]];
				
			}
		});

		return {
			...element,
			type: "conditionComponent"
		}

	}

	// fungsi untuk menyusun component
	// dari bentuk DOM TREE ke dalam 
	// bentuk real DOM TREE
	rootElement(child,parent){

		if(child.type === "conditionComponent"){
		
			parent.appendChild(child.element)
			child.update()
		
		}else{
		
			parent.appendChild(child.element);

		}

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