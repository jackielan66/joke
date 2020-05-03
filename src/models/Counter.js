// 专门用来计数器自定义字段 自增用的model

var mongoose = require('mongoose');


const CounterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('counter', CounterSchema);

exports.Counter = Counter