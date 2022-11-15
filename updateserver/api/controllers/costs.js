const mongoose = require("mongoose");
const stuffCost = require("../models/costs");
const notsearch = require("../helper/Filter")

exports.getbyDate = async (req, res) => {

    const start = new Date([req.params.sdate])
    const end = new Date([req.params.edate])
    let { search, page, limit } = req.query
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10; 
    const regex = new RegExp(search, "i")
    const skip = notsearch(page)(limit)

    const searchDB = {
        $and: [
            { DescCost: { $regex: regex } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }
    const total = await stuffCost.find(searchDB).countDocuments();
    try {

        const getDocs = await stuffCost
            .find(searchDB)
            .limit(limit)
            .skip(skip)
            .select({ __v: 0 })

        if (getDocs == null) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json(
            {
                costDetail: getDocs,
                total: total
            }
        );
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error" + e
        });
    }
};

exports.getCosts = async (req, res) => {
    let { search, page, limit } = req.query
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notsearch(page)(limit)

    const searchDB = {
        $and: [
            { DescCost: { $regex: regex } },
        ]
    }
    const total = await stuffCost.find(searchDB).countDocuments();

    try {
        const getDocs = await stuffCost
            .find(searchDB)
            .skip(skip)
            .limit(limit)
            .select({ __v: 0 })

        if (getDocs == null) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json(
            {
                costDetail: getDocs,
                total: total
            }
        );
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.createCost = async (req, res) => {
    const addStuffCost = new stuffCost({
        _id: mongoose.Types.ObjectId(),
        OtherCost: req.body.cost,
        DescCost: req.body.DESC,
        actionDate: req.body.date
    });

    addStuffCost
        .save()
        .then((out) => {
            res.status(201).json({
                message: "Cost has been created"
            });
        })
        .catch((e) => {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        });

};

exports.updateCost = async (req, res) => {

    const id = req.params.Id
    updateopcost = {
        OtherCost: req.body.cost,
        DescCost: req.body.DESC,
        actionDate: req.body.date
    }

    try {

        updateCost = await stuffCost.findOneAndUpdate(
            { _id: id },
            { $set: updateopcost },
            { new: true }
        );
        res.status(200).json({
            costDetail: updateCost
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internl Server Error"
        });
    }
};

exports.deleteCost = async (req, res) => {
    const id = req.params.Id;
    stuffCost.findOneAndDelete({ _id: id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({
                message: "Bad Request"
            });
        } else if (docs) {
            res.status(204).json({});
        } else {
            return res.status(500).json({
                message: "Internl Server Error"
            });
        }
    });
};
