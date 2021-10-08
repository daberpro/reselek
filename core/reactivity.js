
// class untuk memebuat
// reaktifitas dengan menggunakan setter dan getter
// dan menggunakan proxy
export class Reactivity{

	constructor(object,fragment = {}){

		this.object = object;
		this.fragment = fragment;

	}

	create({eventSetter,eventGetter}){

		const fragment = this.fragment;

		const obj = this.object;

		return new Proxy(this.object,{

			set(args1,args2,args3,args4,obj){

				eventSetter([args1,args2,args3,args4,fragment]);

				return true;
			},
			get(args1,args2,args3,args4){

				return eventGetter([args1,args2,args3,args4,fragment]);

			}

		});

	}

}