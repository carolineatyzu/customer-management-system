const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Soldier = mongoose.Schema({
  name: String,
  rank: String,
  sex: String,
  startDate: Date,
  phone: String,
  email: String,
  avatar: Buffer,
  superior: {type: mongoose.Schema.Types.ObjectId, ref: 'Soldier'},
});
Soldier.plugin(mongoosePaginate);

module.exports = mongoose.model('Soldier',Soldier);