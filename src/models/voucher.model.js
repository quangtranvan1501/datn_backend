const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['percent', 'amount'] },
  expirationDate: { type: Date, required: true },
  used: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number, required: true },
});

VoucherSchema.plugin(toJSON);
VoucherSchema.plugin(paginate);

module.exports = mongoose.model('Voucher', VoucherSchema);
