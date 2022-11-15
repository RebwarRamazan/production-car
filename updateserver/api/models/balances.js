const mongoose = require("mongoose")

const balanceSchema = mongoose.Schema({

        amount: Number, 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        carId: { type: mongoose.Schema.Types.ObjectId, ref: "Cars" },
        action: String,
        actionDate: { type: Date, default: Date.now, get: dateFormat }
         
}, {toJSON: {getters: true}})
function dateFormat(date) {
        return date ? date.toJSON().split("T")[0] : (new Date()).toJSON().split("T")[0];
      } 
module.exports = mongoose.model('Balance', balanceSchema)