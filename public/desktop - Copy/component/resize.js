Cakes.create('resize', null, {
    utils(){
        this.getRect = (el)=>{
          
            let {width, height} = (el && el.getClientRects()[0]) || {width:0, height:0};
            return {width, height};
        };
        this.apply = (el, w, h)=>{
            if (w && h){
                el.style = `width:${w}px;height:${h}px`;
            } else if (w){
                el.style = `width:${w}px`;
            } else if (h){
                el.style = `height:${h}px`;
            }
        };
        
    },
    trigger(){
        let timer;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
              if(entry.contentBoxSize) {
                // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;

                const rect = {width:contentBoxSize.inlineSize, height:contentBoxSize.blockSize}

                // clearTimeout(timer);
                // timer = setTimeout(()=>{
                //     this.fire.resize(null, true);
                // }, 500);

              } else {
        
              }
            };
        });
        resizeObserver.observe(document.body);
    },
    handlers:{
        resizeHeightByTable(){

        },
        resize(){}
    },
    subscribe:{
    },
});