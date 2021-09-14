;(function(global){
    function Templating(data, template, isConvert){
        this.data = data;
        this.template = template;
        this.isConvert = isConvert;
    };
    Templating.prototype._getTag = function(template){
        //get the tag in < h1>;
        return template.match(new RegExp('(?<=<)|([^/s]+)(?=\>)', 'g'))[2];
    };
    Templating.prototype._bindReplace = function(obj,string){
        for (let key in obj){
            let pattern = new RegExp(`{{${key}}}`, 'g');
            pattern && (string = string.replace(pattern, `${obj[key]}`));
        };
        return string;
    };
    Templating.prototype._toElement = function(template, tag){
        let fr = document.createElement('template');
        fr.innerHTML = template;
        return fr.content.children[0];
    };
    Templating.prototype.createElement = function(){
        let template = this.template;
        let data = this.data;
        let isConvert = this.isConvert;
    
    
        if (data){
            if (data instanceof Array){
                let isString = typeof template == 'string';
                let tag = (isString)?this._getTag(template): template.tagName;
                template = (isString)?template:template.outerHTML;
    
                let els = [];
                for (let d = 0; d < data.length; d++){
                    let dd = data[d];
                    let bindData = this._bindReplace(dd, template);
                    let element = this._toElement(bindData, tag);
                    if (isConvert){
                        element = element.outerHTML;
                    };
                    els.push(element);
                };
                return els;
            } else if (data instanceof Object){
                // console.log(template)
                let isString = typeof template == 'string';
                let tag = (isString)?this._getTag(template): template.tagName;
                template = (isString)?template:template.outerHTML;
    
    
                let bindData = this._bindReplace(data, template);
                let element = this._toElement(bindData, tag);
                if (isConvert){
                    element = element.outerHTML;
                };
                return element;
            }
        } else {
            let isString = typeof template == 'string';
            let tag = (isString)?this._getTag(template): template.tagName;
            return this._toElement(template, tag);
        };
    };
    global.Templating = Templating;
})(window);