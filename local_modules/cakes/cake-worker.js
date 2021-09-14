this.onmessage = function(e){
    console.log(e.data);
    router(e.data);
};

let result, routes;

function router(obj){
    let {route, data} = obj;
    if (routes[route]){
        result = routes[route](data);
        
        this.postMessage({status:200, data:result});
    } else {
        this.postMessage({status:400, message:`${route} route not found`});
    }
}

let store = {
    subscribe:{},
};
routes = {
   registerSubscribe(subscribe){
       console.log(subscribe)
    //     let st = store[subscribe];

    //     for (let component in subscribe){
    //         let events = subscribe[component];
    //         if (!st[component]){
    //             st[component] = {};
    //         }
    //         for (let event in events){
    //             if (!st[component][event]){
    //                 st[component][event] = [];
    //             };
    //             st[component][event].push(events[event]);
    //         };
    //     };
    //     console.log(subscribe);

   },
   getSuscribe(){
       return store.subscribe;
   }
}

