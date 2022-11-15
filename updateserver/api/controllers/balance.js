const bal = require('../models/balances')
const mongoose = require('mongoose')
const notSearch = require('../helper/Filter')


exports.getBals = async (req, res) => {


    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { "user.userName": { $regex: regex } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {


        const getTotal = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: searchDB
            },
            { $count: "total" }
        ]);
        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    carList: { $push: { userName: '$user.userName',amount: '$amount', userid : '$userId',carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id' } }

                }
            }

        ]);


        [{ total }] = getTotal;
        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0], userId : carList[item].userid, _id: carList[item]._id,
                amount :carList[item].amount , carId: carList[item].carid[0], car_modeName: carList[item].car_modeName[0]
            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

exports.getBalByID = async (req, res) => {

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { userId: req.params.Id },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {
        const total = await bal.find(searchDB).countDocuments();
        const balHistory = await bal
            .find(searchDB)
            .select({ userId: 0, __v: 0 })
            .populate('carId')

        if (balHistory.length < 1) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json({
            History: balHistory,
            total : total
        })
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


exports.createBal = async (req, res) => {

    addBal = new bal({
        _id: mongoose.Types.ObjectId(),
        amount: req.body.amount,
        carId: req.body.carId,
        userId: req.body.userId,
        action: req.body.action,
    })


    addBal
        .save()
        .then(doc => {
            res.status(200).json({
                message: "history added"
            })
        })
        .catch(err =>
            res.status(500).json({
                erro: err
            }))
}

exports.updateBal = async (req, res, next) => {

    const id = req.params.Id

    const updateops = {
        amount: req.body.amount,
        carId: req.body.carId,
        userId: req.body.userId,
        action: req.body.action,
    }

    updateQars = await bal.findOneAndUpdate({ _id: id }, { $set: updateops }, { new: true })


    res.status(200).json({

        detail: updateQars

    })

}

exports.deleteBal = async (req, res, next) => {

    const id = req.params.Id

    bal.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount < 1) {
                return res.status(404).json({
                    message: "Not Found",
                });
            }
            res.status(204).json({});
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal Server Error"
            });
        });

}