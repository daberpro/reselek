
// class untuk memebuat
// reaktifitas dengan menggunakan setter dan getter
// dan menggunakan proxy
export class Reactivity{

	constructor(object){

		this.object = object;

	}

	create({eventSetter,eventGetter}){

		return new Proxy(this.object,{

			set(args1,args2,args3,args4){

				eventSetter([args1,args2,args3,args4]);

				return true;
			},
			get(args1,args2,args3,args4){

				eventGetter([args1,args2,args3,args4]);

				return true;
			}

		});

	}

}