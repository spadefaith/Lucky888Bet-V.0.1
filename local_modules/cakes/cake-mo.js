;class Mo{
    constructor(config=[],html){
        this.html = html || document;
        this.cf = config;
        this.duration = 300;
    }
    animate(moment){
        this.config = this.parse(this.cf);

        return new Promise((res)=>{
            for (let i = 0; i < this.config.length; i++){
                let cf = this.config[i];
                // console.log(cf)

                let {element} = cf;
                //when there is no config for certain moment, render || remove
                //safekeep
                if (!cf[moment]){ res();break;};
                let config = cf[moment];
                if (!config.options && !(config.options && config.options.duration)){
                    config.options = {duration : this.duration};
                };
                if (!config.keyframes && !element){continue;}

                let keyframes = config.keyframes;
                let index = 0;
                let fr = [];
                for (let k = 0; k < keyframes.length; k++){
                    let kk = keyframes[k];
                    switch(true){
                        case typeof kk == 'string':{
                            fr.push(this.dic(kk));
                        } break;
                        case (kk instanceof Object):{
                            //maybe the offset is declared along with the keyframes;
                            //name - refers to default animation
                            let {name, offset} = kk;
                            if (name && offset){
                                //support for element.animation - offset, equivalent to 10%-100% css @keyframes;
                                let def = this.dic(name);
                                def[def.length-1].offset = offset;
                                fr.push(def);
                            } else {
                                fr.push(kk)
                            }
                        }
                    };
                }
                keyframes = fr;
                fr = null;
                //to series calls of animation, one after the another;
                // console.log(element, keyframes, config);
                let recurseCall= ()=>{
                    let kf = keyframes[index];
                    let animate = element.animate(kf, (config.options || this.duration));
                    animate.finished.then(()=>{
                        if (index < keyframes.length -1){
                            index += 1;
                            recurseCall()
                        } else {
                            keyframes = [];
                            // console.log(index, keyframes.length)
                            res();
                        }
                    });
                }; recurseCall();
            };
        });
    }
    parse(config){
        let configs = [], length = config.length, i = -1;
        // console.log(config);
        while(++i < length){
            let cf = config[i];
            let selector = cf.selector, el;
            
            switch(true){
                case !!(selector.val && selector.attr):{
                    el = this.html.querySelectorIncluded(`[${selector.attr}=${selector.val}]`, selector.attr, selector.val);
                } break;
                case !!(selector.val && !selector.attr):{
                    let attr = selector.val.match(new RegExp(`^[.]`))?'class':
                    selector.val.match(new RegExp(`^[#]`))?'id':null;
                    let val = (attr)?selector.val.slice(1):null;
                    el = this.html.querySelectorIncluded(selector.val, attr, val);
                } break;
            };
            cf.element = el;
            configs.push(cf);
        };
        // console.log(configs);
        return configs;
    }
    dic(name){
        let coll = {
            slideOutUp:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutRight:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutLeft:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutDown:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideInUp:[{
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInRight:[{
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInLeft:[{
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0",
                easing:'ease-out',
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInDown:[{
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            disappear:[{
                opacity: "1"
            },{
                opacity: "0"
            }],
            appear:[{
                opacity: "0"
            },{
                opacity: "1"
            }],
            flipInX:[
                ,{offset:0, backfaceVisibility: "visible"}
                ,{transform: "perspective(400px) rotate3d(1,0,0,90deg)",opacity: "0", offset:0}
                ,{transform: "perspective(400px) rotate3d(1,0,0,-20deg)", offset: 0.4,easing:'ease-in'}
                ,{offset:0.6,  opacity: "1",transform: "perspective(400px) rotate3d(1,0,0,10deg)"}
                ,{transform: "perspective(400px) rotate3d(1,0,0,-5deg)", offset:0.8}
                ,{offset:1, backfaceVisibility: "visible",transform: "perspective(400px) rotate3d(1,0,0,0)"}
            ],
        };
        return coll[name.trim()] || [];
    }
};