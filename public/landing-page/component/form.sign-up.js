Cakes.create('form.sign-up', '#form.sign-up', {
    root:'[name=form-container]',
    data(self){

        this.fields = {
            1:{
                display:'Mobile Number',
                fields:[
                    'mobile_number',
                ]
            },
            2:{
                display:'OTP Verification',
                fields:[
                    'otp',
                ]
            },
            3:{
                display:'Identity Details',
                fields:[
                    'branch',
                    'citation',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'gender',
                    'birth_date',
                    'birth_place',
                    'nationality',
                    'civil_status',
                    'occupation',
                    'agree',
                ]
            },
            4:{
                display:'Address Details',
                fields:[
                    'address.province',
                    'address.building',
                    'address.city',
                    'address.street',
                    'address.barangay',
                    'address.house/unit/floor',
                    'address.full_address',
                ]
            },
            5:{
                display:'Account Details',
                fields:[
                    'contact.email_address',
                    'contact.email_address_confirmed',
                    'file.id'
                ],
            },
        }

        this.step = 1;
    },
    utils(self){
        this.getField = ()=>{
            let {display, fields} = self.data.fields[self.data.step];
            self.data.formDisplay = display;
            return fields.map(item=>{
                item.id = item;
                return FIELDS[item];
            });
        }
    },
    handlers:{
        destroy(){},
        next(e){
            console.log(e);
        },
        cancel(e){
            console.log(e);
        },
        submit(e){
            console.log(e);
        },
        isConnected(e){
            let fields = this.utils.getField();

        },
    },
    subscribe:{
        'render-sign-up':{
            components:['modal'],
            handler(e){
                this.render({hashed:true});
            },
        }
    },
});