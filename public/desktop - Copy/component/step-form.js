Cakes.create('step-form', '#step-form', {
    root:'[name=modal-content]',
    toggle:{
        step:{cls:'active', basis:'name' ,ns:'step'},
    },
    animate:{
        form:{
            render:{keyframes:['appear']},
            remove:{keyframes:['disappear']},
        },
    },
    data(){
        //your account
        let cities = ["Agusan del Norte"
            ,"Agusan del Sur"
            ,"Alaminos"
            ,"Albay"
            ,"Angeles City"
            ,"Antipolo"
            ,"Bacolod"
            ,"Bacoor"
            ,"Bago"
            ,"Baguio"
            ,"Bais"
            ,"Balanga"
            ,"Basilan"
            ,"Bataan"
            ,"Batac"
            ,"Batangas"
            ,"Batangas City"
            ,"Bayawan"
            ,"Baybay"
            ,"Bayugan"
            ,"Benguet"
            ,"Biñan"
            ,"Bislig"
            ,"Bogo"
            ,"Bohol"
            ,"Borongan"
            ,"Bukidnon"
            ,"Bulacan"
            ,"Butuan"
            ,"Cabadbaran"
            ,"Cabanatuan"
            ,"Cabuyao"
            ,"Cadiz"
            ,"Cagayan"
            ,"Cagayan de Oro"
            ,"Cainta"
            ,"Calamba"
            ,"Calapan"
            ,"Calbayog"
            ,"Caloocan"
            ,"Camarines Sur"
            ,"Candon"
            ,"Canlaon"
            ,"Capiz"
            ,"CAR"
            ,"Carcar"
            ,"Catbalogan"
            ,"Cauayan"
            ,"Cavite"
            ,"Cavite City"
            ,"Cebu"
            ,"Cebu City"
            ,"Cotabato"
            ,"Cotabato City"
            ,"Dagupan"
            ,"Danao"
            ,"Dapitan"
            ,"Dasmariñas"
            ,"Davao City"
            ,"Davao del Norte"
            ,"Davao del Sur"
            ,"Davao Oriental"
            ,"Digos"
            ,"Dipolog"
            ,"Dumaguete"
            ,"Eastern Samar"
            ,"El Salvador"
            ,"Escalante"
            ,"Gapan"
            ,"General Santos"
            ,"General Trias"
            ,"Gingoog"
            ,"Guihulngan"
            ,"Himamaylan"
            ,"Ilagan"
            ,"Iligan"
            ,"Ilocos Norte"
            ,"Ilocos Sur"
            ,"Iloilo"
            ,"Iloilo City"
            ,"Imus"
            ,"Iriga"
            ,"Isabela"
            ,"Kabankalan"
            ,"Kalinga"
            ,"Kidapawan"
            ,"Koronadal"
            ,"La Carlota"
            ,"La Union"
            ,"Laguna"
            ,"Lamitan"
            ,"Lanao del Norte"
            ,"Lanao del Sur"
            ,"Laoag"
            ,"Lapu-Lapu City"
            ,"Las Piñas"
            ,"Legazpi"
            ,"Leyte"
            ,"Ligao"
            ,"Lipa"
            ,"Lucena"
            ,"Maasin"
            ,"Mabalacat"
            ,"Maguindanao"
            ,"Makati"
            ,"Malabon"
            ,"Malaybalay"
            ,"Malolos"
            ,"Mandaluyong"
            ,"Mandaue"
            ,"Manila"
            ,"Marawi"
            ,"Marikina"
            ,"Masbate"
            ,"Masbate City"
            ,"Mati"
            ,"Meycauayan"
            ,"Mimaropa"
            ,"Misamis Occidental"
            ,"Misamis Oriental"
            ,"Muñoz"
            ,"Muntinlupa"
            ,"Naga"
            ,"Navotas"
            ,"NCR"
            ,"Negros Occidental"
            ,"Negros Oriental"
            ,"Nueva Ecija"
            ,"Olongapo"
            ,"Oriental Mindoro"
            ,"Ormoc"
            ,"Oroquieta"
            ,"Ozamiz"
            ,"Pagadian"
            ,"Palawan"
            ,"Palayan"
            ,"Pampanga"
            ,"Panabo"
            ,"Pangasinan"
            ,"Parañaque"
            ,"Pasay"
            ,"Pasig"
            ,"Passi"
            ,"Philippine Statistics Authority"
            ,"Puerto Princesa"
            ,"Quezon"
            ,"Quezon City"
            ,"Rizal"
            ,"Roxas"
            ,"Sagay"
            ,"Samal"
            ,"Samar"
            ,"San Carlos"
            ,"San Fernando"
            ,"San Jose"
            ,"San Jose del Monte"
            ,"San Juan"
            ,"San Pablo"
            ,"San Pedro"
            ,"Santa Rosa"
            ,"Santiago"
            ,"Santo Tomas"
            ,"Silay"
            ,"Sipalay"
            ,"Sorsogon"
            ,"Sorsogon City"
            ,"South Cotabato"
            ,"Southern Leyte"
            ,"Sultan Kudarat"
            ,"Surigao City"
            ,"Surigao del Norte"
            ,"Surigao del Sur"
            ,"Tabaco"
            ,"Tabuk"
            ,"Tacloban"
            ,"Tacurong"
            ,"Tagaytay"
            ,"Tagbilaran"
            ,"Taguig"
            ,"Tagum"
            ,"Talisay"
            ,"Tanauan"
            ,"Tandag"
            ,"Tangub"
            ,"Tanjay"
            ,"Tarlac"
            ,"Tarlac City"
            ,"Tayabas"
            ,"Toledo"
            ,"Trece Martires"
            ,"Tuguegarao"
            ,"Urdaneta"
            ,"Valencia"
            ,"Valenzuela"
            ,"Victorias"
            ,"Vigan"
            ,"Zambales"
            ,"Zamboanga City"
            ,"Zamboanga del Norte"
            ,"Zamboanga del Sur"
        ];
        cities = cities.map(city=>{
            return {value:city, text:city}
        });

        // console.log(cities);

        this.first=[
            {title:'Phone Number', id:'phone', tag:'input', type:'phone'},
            {title:'Email Address', id:'email', tag:'input', type:'email'},
            {title:'Username', id:'username', tag:'input', type:'text'},
            {title:'Password', id:'password', tag:'input', type:'password'},
            {title:'Confirm Password', id:'confirm_password', tag:'input', type:'password'},
            
        ];
        //about you
        this.second=[
            {title:'Title', tag:'select', id:'title', options:[
                {value:'Mr', text:'Mr'},
                {value:'Mrs', text:'Mrs'},
                {value:'Ms', text:'Ms'},
            ], tag:'select'},
            {title:'Date of Birth',id:'birthdate', text:'birthdate', tag:'input',type:'date'},
            {title:'First Name', id:'first_name', text:'first_name', tag:'input',type:'text'},
            {title:'Last Name', id:'last_name',text:'last_name', tag:'input',type:'text'},
            {title:'Gender',id:'gender', text:'gender', tag:'input',type:'text'},
            {title:'Marital Status',id:'marital', text:'marital', tag:'input',type:'text'},
            {title:'Nationality',id:'nationality', text:'nationality', tag:'input',type:'text'},
            {title:'Place of Birth',id:'birthplace', text:'birthplace', tag:'input',type:'text'},
        ];
        //contact details
        this.third=[
            {title:'Address', id:'address',tag:'input',type:'text'},
            {title:'City', id:'city',tag:'input',type:'text'},
            {title:'State/ Province/ Region', id:'state', tag:'select', options:cities}, 
            {title:'Zip Code', id:'zip',tag:'input',type:'text'},
            {title:'Phone Number', id:'phone',tag:'input',type:'text'},
        ];

        this.fourth=[
            {title:'Primary ID', id:'primary_id',tag:'input',type:'text'},
            {title:'Primary ID', id:'primary_id_attach',tag:'input',type:'file'},
            {title:'Secondary ID', id:'secondary_id',tag:'input',type:'text'},
            {title:'Secondary ID', id:'secondary_id_attach',tag:'input',type:'file'},
            {title:'Proof of Identity', id:'proof_identity',tag:'input',type:'file'},
        ];
        this.fifth=[
            {title:'E-Bingo', id:'e-bingo',tag:'checkbox',type:'text'},
            {title:'E-Games', id:'e-games',tag:'checkbox',type:'text'},
            {title:'E-Sabong', id:'e-sabong',tag:'checkbox',type:'text'},
            {title:'Sports', id:'sports',tag:'checkbox',type:'text'},
            {title:'All', id:'all',tag:'checkbox',type:'text'},
        ];

        this.buttons = {
            first:[{display:'proceed', cls:'btn btn-secondary', type:'submit'}],
            second:[{display:'previous', cls:'btn btn-secondary', type:'button'}, {display:'next', cls:'btn btn-success', type:'submit'}],
            third:[{display:'previous', cls:'btn btn-secondary', type:'button'}, {display:'next', cls:'btn btn-success', type:'submit'}],
            fourth:[{display:'previous', cls:'btn btn-secondary', type:'button'}, {display:'next', cls:'btn btn-success', type:'submit'}],
            fifth:[{display:'previous', cls:'btn btn-secondary', type:'button'}, {display:'submit', cls:'btn btn-success', type:'submit'}],
        };

        this.state = 0;
        this.steps = ['first', 'second', 'third', 'fourth', 'fifth'];
    },
    handlers:{
        destroy(){
            console.log('isdestroyed')
            this.reset();
            this.$scope.formControls = null;
            this.$scope.formButtons = null;
        },
        formSubmit(e){
            console.log(e);
        },
        isConnected(){
            let step = this.data.steps[this.data.state];
            let cf = this.data[step];


            this.$scope.formControls = cf;
            this.$scope.formButtons = this.data.buttons[step];
            this.toggler('step', step);
            this.toggler.recall('step');
        },
        store(obj){

        },
        click(e){
            let act = e.target.textContent;
            let m = {
                proceed:1,
                previous:-1,
                next:1,
                submit:0,
            };
            let formData = new FormData(this.container.form);
            let o = {};
            for (let [key, value] of formData.entries()){
                if (!key.includes('{{')){
                    o[key] = value;
                }
            };

            if (this.data.collected){
                this.data.collected = Object.assign(this.data.collected , o);
            } else {
                this.data.collected = o;
            };
            if (m[act] != undefined){
                this.data.state += m[act];
                if (act == 'submit'){
                    this.fire(function formSubmit(){return this.data.collected});
                } else {
                    setTimeout(()=>{
                        this.fire.rerender();
                    }, 500);
                }
            }
        },
        rerender(){
            this.fire.destroy();
            this.render();
        },
    },
    subscribe:{
        modal:{
            renderRegisterForm(){
                this.render()
            },
            destroysignup(e){
                this.fire.destroy();
            }
        }
    },
})