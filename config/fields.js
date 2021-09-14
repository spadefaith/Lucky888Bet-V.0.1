let FIELDS = {
    trans_date:{display:'Transaction Date',tag:'input', type:'date',ui:'table/form/schema',},
    'contact.email_address':{display:'Email Address',tag:'input', type:'text',ui:'table/form/schema',},
    'contact.email_address_confirmed':{display:'Confirm Email',tag:'input', type:'text',ui:'table/form/schema',},
    username:{display:'Username',tag:'input', type:'text',ui:'table/form/schema',},
    password:{display:'Password',tag:'input', type:'text',ui:'table/form/schema',},
    branch:{display:'Branch',tag:'input', type:'text',ui:'table/form/schema',},
    otp:{display:'OTP',tag:'input', type:'text',ui:'table/form/schema',},
    citation:{display:'Title',tag:'input', type:'text',ui:'table/form/schema',},
    first_name:{display:'First Name',tag:'input', type:'text',ui:'table/form/schema',},
    last_name:{display:'Last Name',tag:'input', type:'text',ui:'table/form/schema',},
    middle_name:{display:'Middle Name',tag:'input', type:'text',ui:'table/form/schema',},
    gender:{display:'Gender',tag:'input', type:'text',ui:'table/form/schema',},
    birth_date:{display:'Birth Date',tag:'input', type:'text',ui:'table/form/schema',},
    birth_place:{display:'Birth Place',tag:'input', type:'text',ui:'table/form/schema',},
    mobile_number:{display:'Mobile Number',tag:'input', type:'text',ui:'table/form/schema',},
    otp:{display:'OTP',tag:'input', type:'text',ui:'table/form/schema',},
    _id:{display:'ID', tag:'input', ui:'schema', type:'text'},
    nationality:{display:'Nationality', tag:'input', ui:'schema', type:'text'},
    civil_status:{display:'Civil Status', tag:'input', ui:'schema', type:'text'},
    occupation:{display:'Occupation', tag:'input', ui:'schema', type:'text'},
    agree:{display:'Agree', tag:'input', ui:'schema', type:'text'},
    
    'address.city':{display:'City',tag:'input', type:'text',ui:'table/form/schema',},
    'address.building':{display:'Building',tag:'input', type:'text',ui:'table/form/schema',},
    'address.province':{display:'Province',tag:'input', type:'text',ui:'table/form/schema',},
    'address.full_address':{display:'Address',tag:'input', type:'text',ui:'table/form/schema',},
    'address.street':{display:'Street',tag:'input', type:'text',ui:'table/form/schema',},
    'address.barangay':{display:'Barangay',tag:'input', type:'text',ui:'table/form/schema',},
    'address.house/unit/floor':{display:'House/Unit/Floor Number',tag:'input', type:'text',ui:'table/form/schema',},
    'file.id':{display:'Valid ID',tag:'input', type:'text',ui:'table/form/schema',},
};

try{
    module.exports = FIELDS;
} catch(err){
    
}



