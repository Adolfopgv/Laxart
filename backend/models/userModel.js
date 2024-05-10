const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    repeatPassword: {
        type: String,
    },
    shippingAddress: {
        address1: {
            type: String,
        },
        address2: {
            type: String
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        province: {
            type: String,
        },
        postalCode: {
            type: String,
        }
    },
    billingAddress: {
        address1: {
            type: String,
        },
        address2: {
            type: String
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        province: {
            type: String,
        },
        postalCode: {
            type: String,
        }
    }
},
    { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;