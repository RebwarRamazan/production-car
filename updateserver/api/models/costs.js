const { number } = require('joi')
const mongoose = require('mongoose')

const costSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: Number,
    isSold: Boolean,
    pricePaidbid: Number,
    feesinAmericaStoragefee: Number,
    feesinAmericaCopartorIAAfee: Number,
    feesAndRepaidCostDubairepairCost: Number,
    feesAndRepaidCostDubaiFees: Number,
    feesAndRepaidCostDubaiothers: Number,
    feesAndRepaidCostDubainote: String,
    coCCost: Number,
    transportationCostFromAmericaLocationtoDubaiGCostLocation: String,
    transportationCostFromAmericaLocationtoDubaiGCostTranscost: Number,
    transportationCostFromAmericaLocationtoDubaiGCostgumrgCost: Number,
    dubaiToIraqGCostTranscost: Number,
    dubaiToIraqGCostgumrgCost: Number,
    raqamAndRepairCostinKurdistanrepairCost: Number,
    raqamAndRepairCostinKurdistanRaqam: Number,
    raqamAndRepairCostinKurdistanothers: Number,
    raqamAndRepairCostinKurdistannote: String,
    raqamAndRepairCostinKurdistannote: String,
    OtherCost: Number,
    DescCost: String,
    actionDate:{ type: Date, default: Date.now, get: dateFormat },

}, {toJSON: {getters: true}})

function dateFormat(date) {
    return date?.toJSON().split("T")[0];
  }
  

module.exports = mongoose.model('CostPlusPricing', costSchema)