Cakes.create('form', '#form', {
    root:'#modal-content',
    role:'form',
    data(){
        this.optionsTemplate=`<option value={{value}}>{{display}}</option>`;
    },
    animate:{
        form:{
            remove:{keyframes:['disappear'],options:{duration:100}},
        }
    },
    handlers:{
        destroy(){
            this.reset();
            this.$scope.formControls = null;
            this.$scope.activeMenu = null;
            this.$scope.formOptions = null;
            this.data.forEdit = {_rev:null};
        },
        isConnected(){
            let {formFields, menu, options, searchFields} = this.$scope.uiConfig;
            let fields = (this.data.mode == 'search')?searchFields:formFields;

            this.$scope.formControls = fields;
            this.$scope.activeMenu = this.$scope.uiConfig.display;

            //the options is setup in app;
            this.$form.options({options}, true).then(opts=>{
                let {virtual, select} = opts;
                // this.$scope.formOptions = opts;
                if (this.data.mode == 'search'){

                    this.fire(function renderVirtual(){ return virtual });
                }
            });

        },
        plotData(obj){
            if (!obj){ return };
            let {_id} = obj;
            this.fire(function spinnerRender(){});
            const plot = async ()=>{
                let {formFields, menu, options} = this.$scope.uiConfig;
                let data = await this.fire(function getRecord(){return {_id, tbl:menu}});
                this.data.forEdit = data;
                // console.log(data);
                this.$form.plot({data, container:this.container.form});
            };

            plot().then(()=>{
                this.fire(function spinnerDestroy(){});
            });
        },
        submit(e){
            let formData = new FormData(e.target);
            let obj = {};
            obj.trans_date = new Date().toLocaleDateString();
            for (let [key, value] of formData){
                if (!key.includes('{')){
                    obj[key] = value;
                };
            };
            let {menu:tbl} = this.$scope.uiConfig;
            let prom = Promise.resolve();
            if (this.data.mode == 'edit'){
                let {_id, _rev} = this.data.forEdit || {_id:null, _rev:null};
                //for edit module;
                prom = this.fire(function getRecord(){return {_id, tbl}})
                prom.then(data=>{
                    let _rev = data._rev;
                    this.fire(function spinnerRender(){});
                    this.fire(function formSubmit(){ return {_id,_rev,mode:this.data.mode,tbl, data:obj}});
                });
            } else if (this.data.mode =='create'){
                //definitely for create;
                this.fire(function formSubmit(){ return {mode:this.data.mode,tbl, data:obj}});
            } else if (this.data.mode == 'search'){

                this.fire(function spinnerRender(){});

                this.fire(function getValueText(){}).then(r=>{
                    obj = Object.assign(obj, {name:r});
                    this.fire(function formSearchSubmit(){ return {tbl, data:obj, mode:this.data.mode} });
                });
            };
        },
    },
    subscribe:{
        modal:{
            renderFormModal(obj){
                let {caller, data} = obj;

                if (caller == 'edit'){
                    //edit mode;
                    this.data.mode = 'edit';
                    this.render();
                    this.fire.plotData(data);
                } else if (caller == 'login'){
                    this.data.mode = 'login';
                    this.render();
                } else if (caller == 'register'){
                    this.data.mode = 'create';
                    this.render();                    
                };
            },
            destroyForm(){
                this.fire.destroy();
            },
        },
        virtual:{
            virtualSearchInput(obj){
                let {name, value} = obj;
                let {formFields, menu, options, searchFields} = this.$scope.uiConfig;

                this.$form.options({options, params:{name, value}}, true).then(opts=>{
                    let {virtual, select} = opts;
                    
                    this.fire(function virtualUpdateOptions(){ return {name, q:virtual} });
                });
            }
        }
    },
});

