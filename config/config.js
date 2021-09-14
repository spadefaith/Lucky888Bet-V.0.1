let CONFIG = {
    player:{
        display:'KYC',
        fields:[
            '_id',
            'trans_date',
            'username',
            'password',
            'mobile_number',
            'otp',
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
            'address.province',
            'address.building',
            'address.city',
            'address.street',
            'address.barangay',
            'address.house/unit/floor',
            'address.full_address',
            'contact.email_address',
            'contact.email_address_confirmed',
            'file.id',
        ],
    },

    // deposit:{
    //     display:'Deposit',
    //     fields:[
    //         'trans_date',
    //         '_id',
    //         'amount',
    //         'payment-option',
    //         'reference',
    //         'player_id',
    //     ]
    // },

    // withdraw:{
    //     display:'Deposit',
    //     fields:[
    //         'player_id',
    //         'trans_date',
    //         '_id',
    //         'amount',
    //         'payment-option',
    //         'reference',
    //     ]
    // },

    // gameplay:{
    //     display:'Played Games',
    //     fields:[
    //         'trans_date',
    //         '_id',
    //         'player_id',
    //         'game_id',
    //         'status',
    //         'bet',
    //     ]
    // },

    // game:{
    //     display:'Games',
    //     fields:[
    //         'trans_date',
    //         '_id',
    //         'descrption',
    //         'category',
    //         'remarks',
    //         'game_url',
    //     ]
    // },

    // branch:{
    //     display:'Branches',
    //     fields:[
    //         'trans_date',
    //         '_id',
    //         'description',
    //         'address',
    //     ]
    // }
}
try{
    module.exports = CONFIG;    
} catch(err){
    
}