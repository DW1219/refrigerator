const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    regions: {
        type: Number,
        default: 1
    },
    sold: {                     //몇개나 팔았는지 개수산정을 위해
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {                    //몇명이 조회했는지
        type: Number,
        default: 0
    }
}, { timestamps: true })

//검색될때 가중치 주는 부분 (mongoDB 제공)
//이부분도 더 자세히 알고싶으면 https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/
productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }