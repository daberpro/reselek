
// fungsi check binding adalah fungsi
// yang bertugas untuk membuat dan menentukan
// apakah suatu inner dari suatu fungsi
// memiliki pemanggilan props di dalam nya

export function checkBinding(text_node){

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

// fungsi ini berfungsi untuk membuat element
// dari raw component
export function createElement(name,inner){

	(!(inner.hasOwnProperty("inner")) && inner instanceof Object)? inner["inner"] = "" : 0;

	// variabel element merupakan instance atau 
	// variabel yang berisi HTML element
	let element = document.createElement(name);
	
	// variabel _inner merupakan variabel
	// yang menyimpan text node
	let _inner = document.createTextNode(inner);

	// kemudian menyimpan nilai dari inner
	// ke dalam variabel copyValue untuk kemudian
	// di manipulasi string
	let copyValue = inner["inner"];


	// melakukan pengcekan apakah terdapat props yang
	// di masukan sebagai inner atau tidak
	// dengan cara mengecek apakah inner
	// merupakan object atau tidak
	if(!(inner instanceof Object)){

		// jika tidak maka tambahkan _inner ke dalam element 
		element.appendChild(_inner);

	}

	// jika tidak
	else{

		// kita hilangkan semua tanda sipasi, tab, dan enter / breakline
		// agar regex bisa membaca
		inner["inner"] = inner["inner"]?.replace(/(\n|\t)/igm," ");

		// mengambil nilai binding dari fungsi checkBinding
		// dan menyimpan nya ke dalam variabel bind
		let bind = checkBinding(inner["inner"]);

		// melakukan perulangan pada props
		for(let x in inner["props"]){
				
			// melakukan pengecekan apakah 
			// binding nya ada dan 
			// apakah props terpanggil di
			// binding value 
			if(bind.binding && x in bind.value){

				copyValue = copyValue.replaceAll(bind.value[x],inner["props"][x]);

			}

		}

		// variabel evaluation meruapakan variabel
		// yang akan menyimpan nilai props ke dalam variabel
		let evaluation = "";

		// melakukan perulangan dan mengambil nilai props
		for(let y in inner["props"]){

			// menghandle error
			// ketika melakukan pengecekan
			// dan menentukan variabel dari props
			// ke lokal variabel
			try{

				if(inner["props"][y] instanceof Object && typeof inner["props"][y] !== "function") evaluation += `let ${y} = ${JSON.stringify(inner["props"][y])};`
				if(typeof inner["props"][y] === "number") evaluation += `let ${y} = ${inner["props"][y]};`
				if(typeof inner["props"][y] === "string") evaluation += `let ${y} = "${inner["props"][y]}";`
				if(typeof inner["props"][y] === "function") evaluation += `let ${y} = ${inner["props"][y]};`.replace(/(\n|\t)/igm," ");

			}catch(err){

				// tampilan warning jika terdapat error
				console.warn(err.message)

			}

		}

		// melakukan perulangan
		// untuk melakukan replace terhadap copyValue
		for(let x in bind.value){

			// dan melakukan pengecekan jika
			// nilai binding tidak terdapat
			// di dalam props
			if(!(x in inner["props"])){

				try{

					// melakukan replacement
					copyValue = copyValue.replaceAll(bind.value[x],eval(`${evaluation} ${x}`));

				}catch(err){

					// menampilkan warning jika terdapat error
					console.warn(err.message);

				}

			}

		}

		// mengset ulang _inner dengan nilai copyValue
		_inner = document.createTextNode(copyValue);
		
		// menambahkan textnode dari _inner ke dalam element
		element.appendChild(_inner);

		if(inner.hasOwnProperty("attribute")) for(let x in inner["attribute"]){

			let bind = checkBinding(inner["attribute"][x]);

			if(bind.binding){

				for(let y in bind.value) if(inner["props"].hasOwnProperty(y)){

					element.setAttribute(x,inner["attribute"][x].replaceAll(bind.value[y],inner["props"][y]));					

				}else{

					console.warn(y+" props not found!!");
					element.setAttribute(x,void 0);

				}

			}else{

				element.setAttribute(x,inner["attribute"][x]);

			}

		}

	}

	// mengambil chlidren
	let children = inner["children"] || []
	let content = (typeof inner === "string")? inner : inner["inner"];

	// mengembalikan nilai
	return {
		name,
		_inner,
		element,
		content,
		children,
		props: inner["props"] || {},
		
		// fungsi untuk melakukan update
		// jika terjadi perubahan pada props
		update(){
		
			let _inner = document.createTextNode(inner);

			if(inner.hasOwnProperty("attribute")) for(let x in inner["attribute"]){

				let bind = checkBinding(inner["attribute"][x]);

				if(bind.binding){

					for(let y in bind.value) if(inner["props"].hasOwnProperty(y)){

						element.setAttribute(x,inner["attribute"][x].replaceAll(bind.value[y],inner["props"][y]));					

					}else{

						console.warn(y+" props not found!!");
						element.setAttribute(x,void 0);

					}

				}else{

					element.setAttribute(x,inner["attribute"][x]);

				}

			}

			if((inner instanceof Object)){

				inner["inner"] = inner["inner"].replace(/(\n|\t)/igm," ");

				let bind = checkBinding(inner["inner"]);
				let copyValue = inner["inner"];

				for(let x in this.props){
					
					if(bind.binding && x in bind.value){

						copyValue = copyValue.replaceAll(bind.value[x],this.props[x]);

					}

				}

				let evaluation = "";

				for(let y in this.props){

					try{

						if(this.props[y] instanceof Object && typeof this.props[y] !== "function") evaluation += `let ${y} = ${JSON.stringify(this.props[y])};`
						if(typeof this.props[y] === "number") evaluation += `let ${y} = ${this.props[y]};`
						if(typeof this.props[y] === "string") evaluation += `let ${y} = "${this.props[y]}";`
						if(typeof this.props[y] === "function") evaluation += `let ${y} = ${this.props[y]};`.replace(/(\n|\t)/igm," ");

					}catch(err){

						console.warn(err.message)

					}

				}

				for(let x in bind.value){

					if(!(x in this.props)){

						try{

							copyValue = copyValue.replaceAll(bind.value[x],eval(`${evaluation} ${x}`));

						}catch(err){

							console.warn(err.message);

						}

					}

				}

				this._inner.replaceData(0,this._inner.length,copyValue);
	

			}

		}
	};

}

function rootElement(child,parent){

	parent.appendChild(child.element);

	if(child.children.length > 0){

		for(let x of child.children) rootElement(x,child.element);

	}


}

export function toString(b){

	let c = Object.keys(b).map(e =>{

		if(b[e] instanceof Array){
			return `${e}:[${b[e]}]` 
		}

		if(b[e] instanceof Object && typeof b[e] !== "function"){

			return `${e}:${toString(b[e])}`

		}

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

function toRawComponent(component){

	let children = [];

	if(component.children.length > 0){

		for(let x of component.children){
		
			children.push(toRawComponent(x));
		
		}

	}

	let template = ``;

	if(component.type === "ChildComponent"){

		template = `

			createElement("${component.name}",{
				inner: "${component.content}",
				children: [${children}],
				props: ${toString(component.props)}
			})

		`;

	}

	if(component.type === "LoopComponent"){

		template = `

			loopComponent("${component.name}",{
				inner: "${component.content}",
				child: ${toRawComponent(component.child)},
				props: ${toString(component.props)},
				loop: "${component.loop}"
			})

		`;

	}

	return template;

}

export function loopComponent(name,inner){

	const parentElement = createElement(name,inner);
	let token = inner["loop"].split(" ");

	if(token[2] in inner["props"]){

		try{
			let allChildren = [];

			for(let x of inner["child"]["children"]){

				allChildren.push(toRawComponent(x));

			}

			eval(`for(let ${token[0]} ${token[1]} inner["props"]["${token[2]}"]){

				parentElement["children"].push(createElement(inner["child"].name,{
					inner: inner["child"].content,
					props: {
						${token[0]} 
					},
					children: [${allChildren.join()}]
				}));

			}`);

		}catch(err){

			console.warn(err.message);

		}

	}

	return {
		...parentElement,
		child: inner["child"],
		loop: inner["loop"],
		props: parentElement["props"],
		update(){

			parentElement.update();

			let allElement = [];

			for(let x of this.children){

				x.element.remove();

			}

			this.children = [];

			if(token[2] in this.props){

				try{

					let allChildren = [];

					for(let x of inner["child"]["children"]){

						allChildren.push(toRawComponent(x));

					}

					eval(`for(let ${token[0]} ${token[1]} this.props["${token[2]}"]){

						this.children.push(createElement(inner["child"].name,{
							inner: inner["child"].content,
							props: {
								${token[0]} 
							},
							children: [${allChildren.join()}]
						}));

					}`);

				}catch(err){

					console.warn(err.message);

				}

			}

			for(let x of this.children){

				rootElement(x,parentElement.element);

			}

		}
	}

}

export function desrtoyChild(child){

	child.element.remove();

	if(child.children.length > 0){

		for(let x of child.children) desrtoyChild(x);

	}

}

export function conditionalComponent(name, inner){

	const parentElement = createElement(name,inner);


	if(inner["props"][inner["condition"]]){

		for(let x of parentElement.children){

			rootElement(x,parentElement.element);

		}

	}else{

		for(let x of parentElement.children){

			desrtoyChild(x);

		}

	}

	return {
		...parentElement,
		update(){

			parentElement.update();

			if(inner["props"][inner["condition"]]){

				
				for(let x of parentElement.children){

					rootElement(x,parentElement.element);

				}				


			}else{

				for(let x of parentElement.children){

					desrtoyChild(x);

				}

			}

		}
	}

}