;(function(global){
    function Piece(el){
        this.el = Piece.toArray(el);
    };
    Piece.toArray = function(el){
        let r = [];
        switch(true){
            case (el instanceof Array):{
                r = el;
            } break;
            case (el.length && (el.tagName && el.tagName != 'FORM') && !(el instanceof Array)):{
                for (let e = 0; e < el.length; e++){
                    r.push(el[e]);
                };
            } break;
            case !(el instanceof Array):{
                r = [el];
            } break;
        };
        return r;
    }
    Piece.prototype.getElements = function(){
        return this.el;
    };
    Piece.prototype.getElement = function(){
        return this.el[0];
    };
    Piece.prototype.remove = function(name){
        let i = -1, length = this.el.length;
        let fg = document.createDocumentFragment();
        while(++i < length){
            let el = this.el[i];
            el  && (fg.appendChild(el));
            // el  && el.remove();
        };
        fr = null;
    };
    
    Piece.prototype.replaceDataSrc = function(){
        let els = this.el[0];
        let srcs = els.querySelectorAll('[data-src]');
        for (let s = 0; s < srcs.length; s++){
            el = srcs[s];
            el.setAttribute('src', el.dataset.src);
            el.removeAttribute('data-src');
        };
    };
    
    Piece.cloneNode = function(el){
        el = (el instanceof Array)?el:this.toArray(el);
        let a = [];
        for (let e = 0; e < el.length; e++){
            a.push(el[e].cloneNode(true));
        };
        return new Piece(a);
    };
    Piece.prototype.getContainers = function(){
        let query = this.querySelectorAll(`[data-container]`).toArray();
        // console.log(query)
        if (this.dataset.container){
            console.log(this);
            query.push(this);
        };
        return query;
    };
    Piece.prototype.cloneNode = function(el){
        el = this.el;
        return Piece.cloneNode(el);
    };
    Piece.prototype.getAllElements = function(){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementsByTagName('*').toArray();
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName('*');
                    if (q){
                        for (let i = 0; i < q.length; i++){
                            r.push(q[i]);
                        };
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.appendTo = function(root, cleaned){
        if (!root && !root.attributes){
            throw new TypeError(`the ${root} is not an instance of Element`);
        };
        cleaned && (root.innerHTML = "");
        for (let i = 0; i < this.el.length; i++){
            let el = this.el[i];
            root.appendChild(el);
        };
    };
    Piece.prototype.getElementsByTagName = function(tag){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementsByTagName(id).toArray();
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName(selector);
                    if (q){
                        for (let i = 0; i < q.length; i++){
                            r.push(q[i]);
                        };
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.getElementById = function(ids){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementById(id);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q){
                        r.push(q);
                    };
                };
            } break;
        };
        return r;
    }
    
    Piece.prototype.querySelectorAll = function(selector){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorAll(selector);
            } break;
            case length > 1:{
                let els = [];
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAll(selector);
                    q && (r = r.concat(q.toArra()));
                };
            } break;
            default:{
                r = [];
            }
        };
        return r;
    };
    
    Piece.prototype.querySelector = function(selector){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelector(selector);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q){
                        r.push(q);
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.querySelectorIncluded = function(selector, attr, val){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorIncluded(selector, attr, val);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorIncluded(selector, attr, val);
                    q && (r.push(q))
                };
            } break;
        };
        return r;
    };
    
    
    Piece.prototype.querySelectorAllIncluded = function(selector, attr, val){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorAllIncluded(selector, attr,val);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAllIncluded(selector, attr, val);
                    q && (r = r.concat(q.toArra()));
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.contains = function(el){
        let length = this.el.length, test = false;
        switch(length == 1){
            case true:{
                test = this.el[0].contains(el);
            } break;
            case false:{
               let index = -1;
               while(++index < length){
                   let _el = this.el[index];
                   if (_el.contains(el)){
                    test = true;
                    break;
                   };
               };
            } break;
        }
        return test;
    }
    
    Piece.prototype.dataset = function(data, cb){
        let l = this.el.length;
        let i = -1;
        while(++i < l){
            if (this.el[i].dataset[data]){
                cb(this.el[i]);
            };
        };
        return true;
    }
    
    Piece.prototype.getElementsByDataset = function(){
        let arg, sel, i, a, el, query;
        arg = arguments;
        o = {};
        length = arg.length;
        i = -1;
        a = -1;
        while(++i < this.el.length){
            el = this.el[i];
            while(++a < length){
                sel = arg[a];
                if (el.getAttribute(`data-${sel}`)){
                    o[sel] = [el];
                } else {
                    o[sel] = [];
                }
                query = el.querySelectorAll(`[data-${sel}]`);
                if (query.length){
                    o[sel] = o[sel].concat([...query]);
                };
            };
        };
        return o;
    }
    global.Piece = Piece;
})(window);