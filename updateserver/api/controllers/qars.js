const car = require("../models/cars");
const qars = require('../models/qars')
const mongoose = require('mongoose')
const notSearch = require('../helper/Filter')

exports.getQarsIsSoled = async (req, res) => {

    let _id, carList, obitem, cars = [];
    const bool = (req.params.bool == '1') ? true : false;

    let { search, page, limit } = req.query
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { "car.modeName": { $regex: regex } },
            { "car.isSold": bool }

        ]
    }



    try {


        const getTotal = await qars.aggregate([
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
            { $count: "total" }
        ]);
        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await qars.aggregate([
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
                    carList: { $push: { carDetail: "$car", _id: "$_id" } }

                }
            }

        ]);

        [{ total }] = getTotal;
        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = { carDetail: carList[item].carDetail[0], _id: carList[item]._id }
        }


        res.status(200).json({
            QarzList: cars,
            total: total
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.getQarsAmountByUserID = (req, res) => {
    let { sdate, edate, page, limit } = req.query
    var startDate = (sdate) ? sdate : '2000-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    let end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = notSearch(page)(limit)
    const searchDB = {
        $and: [
            { userId: { $eq: req.params.Id } },
            { qarAmount: { $exists: true } },
            {
                dates: {
                    $gte: start,
                    $lte: end
                }
            }
        ]

    }

    qars.find(searchDB)
        .select({ userId: 0, __v: 0 })
        .skip(skip)
        .limit(limit)
        .then(data => {
            if (data.length < 1) {
                return res.status(404).json({
                    message: "Not Found"
                });
            }

            res.status(200).json({
                qarzList: data
            });

        }).catch(e => res.status(500).json({
            message: "Internal Server Error",
        }))

}


exports.getQarsByUserID = async (req, res) => {

    let { sdate, edate, page, limit } = req.query
    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    let end = new Date([endDate, "24:00:00"])
    end = end.getTime() + (3 * 60 * 60 * 1000)
    end = new Date(end)
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = notSearch(page)(limit)
    const searchDB = {
        $and: [
            { userId: { $eq: req.params.Id } },
            { carId: { $exists: true } },
            {
                dates: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {
        totalItems = await qars.find(searchDB).countDocuments();

        qars.find(searchDB)
            .select({ userId: 0, __v: 0, })
            .limit(limit)
            .skip(skip)
            .populate(
                {
                    path: 'carId',
                    model: 'Cars',
                    select: { 'carCost': 0, 'userGiven': 0, '__v': 0, 'userGiven': 0, 'date': 0, 'arrived': 0 },
                }
            )
            .then(data => {
                if (data.length < 1) {
                    return res.status(404).json({
                        message: "Not Found"
                    });
                }
                res.status(200).json({
                    qarzList: data,
                    total: totalItems
                });

            }).catch(e => res.status(500).json({
                message: "Internal Server Er",
            }))
    } catch (e) {

        res.status(500).json({
            message: "Internal Server Error" + e
        })


    }
}

exports.getDQarsCar = (req, res) => {
    car.findById(req.params.Id)
        .select({ __v: 0, date: 0, userGiven: 0, carCost: 0, arrived: 0 })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "Not Found"
                });
            }
            res.status(200).json({
                carDetail: data
            });
        }).catch(e => {
            res.status(500).json({
                message: "Internal Server Error" + e
            });
        })
};

exports.createQars = async (req, res) => {
    try {
        const addQars = new qars({
            _id: mongoose.Types.ObjectId(),
            qarAmount: req.body.amount,
            userId: req.body.userId,
            carId: req.body.carId,
            isPaid: req.body.isPaid,

        })

        addQars
            .save()
            .then(doc => {
                res.status(201).json({
                    message: "Qarz has been created"
                })
            }).catch(e => {
                res.status(500).json({
                    message: "Internal Server Error"
                })
            })

        // converts to Mongo DB Commands.
        // mongoose.set('debug', true);
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.updateQars = async (req, res, next) => {

    try {
        const id = req.params.Id
        const updateops = {
            qarAmount: req.body.amount,
            userId: req.body.userId,
            carId: req.body.carId,
            isPaid: req.body.isPaid,
        }
        updateQars = await qars
            .findOneAndUpdate({ _id: id }, { $set: updateops })
        if (!updateQars) {
            return res.status(404).json({
                message: "Not Found"
            });
        }
        res.status(200).json({
            Desc: 'Qars is Updated'
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }

}

exports.deleteQars = async (req, res) => {

    const carDoc = await qars.findOne({ _id: req.params.Id })
    if (params.del == "amount") {

        carDoc.qarAmount = undefined

    }

    if (params.del == "car") {

        carDoc.carID = undefined

    }
    const qarsUpdate = await carDoc.save()

    res.status(200).json({
        method: 'Delete',
        cars: 'Single',
        new: qarsUpdate,
        old: carDoc
    })

}
exports.deletePerQars = async (req, res) => {

    const id = req.params.Id

    qars.deleteOne({ _id: id })
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
