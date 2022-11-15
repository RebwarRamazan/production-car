const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const encode = require('../helper/encode')
const notSearch = require("../helper/Filter")

exports.user_signup = async (req, res, next) => {
  try {
    const countUser = await User.find({ email: { $eq: req.body.email } });
    const countUserName = await User.find({ userName: { $eq: req.body.userName } });
    if (countUser.length >= 1 || countUserName.length >= 1)
      return res.status(409).json({
        message: "Mail or UserName exists"
      });

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(401).json({
          error: err,
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          userName: req.body.userName,
          password: hash,
          userRole: req.body.userRole,
          TotalBals: req.body.TotalBals
        });
        user
          .save()
          .then((result) => {
            res.status(201).json({
              message: "User created",
            });
          }).catch((err) => {
            res.status(500).json({
              error: err._message,
            });
          });

      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.user_login = async (req, res, next) => {

  const user = await User.find({ email: { $eq: req.body.email } });

  if (user.length !== 1) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }

  bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    if (result) {

      const userRoleEncode = encode(user[0].userRole);

      const accesstoken = jwt.sign(
        {
          email: user[0].userName,
          userId: userRoleEncode,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "3600s",
        }
      );
      const tokenEXP = jwt.decode(accesstoken).exp;

      const refreshtoken = jwt.sign(
        {
          email: user[0].userName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7200s",

        }
      );
      const refreshEXP = jwt.decode(refreshtoken).exp;

      const addToken = User.findOneAndUpdate(
        { _id: user[0]._id },
        { $set: { token: refreshtoken } },
        { new: true }
      ).then(updateUser => {
      }).catch(e => {
        res.status(401).json({
          message: "Auth failed",
        });
      })

      res.cookie('token', refreshtoken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
      return res.status(200).json({ token: accesstoken, refreshToken: refreshtoken, UserRole: user[0].userRole, id: user[0]._id, tokenEXP: tokenEXP, refreshEXP: refreshEXP });
    }
    res.status(401).json({
      message: "Auth failed",
    });
  });
};


exports.userRefreshToken = async (req, res, next) => {

  if (!req.body.patata) return res.status(401).json({
    message: "Auth failed",
  });
  const coockToken = req.body.patata



  User.findOne({ token: coockToken }).then(userInfo => {
    jwt.verify(coockToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err || userInfo.userName !== decode.email) return res.status(403).json();

      const userRoleEncode = encode(userInfo.userRole);
      const accesstoken = jwt.sign(
        {
          email: decode.email,
          userId: userRoleEncode,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "3600s",
        }
      )

      const tokenEXP = jwt.decode(accesstoken).exp;
      const tokenIAT = jwt.decode(accesstoken).iat;

      return res.status(200).json({ token: accesstoken, tokenEXP: tokenEXP });
    });
  }).catch(e => {
    res.status(401).json({
      message: "Auth failed",
    });
  })
}

exports.logOut = async (req, res, next) => {
  // on Client access token should be deleted
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(204).json({});

  const coockToken = cookies?.token
  try {
    const tokenDB = await User.findOne({ token: coockToken });
    if (!tokenDB) {
      res.clearCookie("token", { httpOnly: true })
      return res.status(204).json({})
    }

    // delete the refreshToken in DB
    await User.findOneAndUpdate({ token: coockToken }, { $set: { token: '' } })
    res.clearCookie("token", { httpOnly: true })
    res.status(204).json({})

  } catch (e) {
    return res.status(400).json({
      message: "Logout Failed"
    });
  }

}


exports.user_delete = async (req, res, next) => {
  try {
    const user = await User.deleteOne({ _id: req.params.Id });
    if (user.deletedCount < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(204).json({});
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.user_update = async (req, res, next) => {
  try {
    const id = req.params.Id
    hash = undefined
    if (req.body.password)
      hash = bcrypt.hashSync(req.body?.password, 10)

    const updateops =
    {
      email: req.body.email,
      userName: req.body.userName,
      userRole: req.body.userRole,
      password: hash,
      TotalBals: req.body.TotalBals
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateops },
      { new: true }
    ).select({ __v: 0 });
    if (!user)
      return res.status(404).json({
        message: "Not Found",
      });
    else
      return res.status(200).json({

        userDetail: user

      });
  } catch (e) {
    res.status(500).json({
      message: "Invalid Operation"
    });
  }
};

exports.user_getUsersByRoles = async (req, res) => {
  const role = req.params.userRole;
  let { search, page, limit } = req.query
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const skip = notSearch(page)(limit)
  const regex = new RegExp(search, "i")

  const searchDB = {
    $and: [
      { userRole: role },
      {
        $or: [
          { userName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      }
    ]
  }
  try {
    totalItems = await User.find(searchDB).countDocuments();
    const getDocs = await User.find(searchDB)
      .limit(limit)
      .skip(skip)
      .select({ __v: 0, password: 0, token: 0 });

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json({ userDetail: getDocs, total: totalItems });


  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.user_get = async (req, res) => {

  let { search, page, limit } = req.query
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const skip = notSearch(page)(limit)
  const regex = new RegExp(search, "i")


  const searchDB = {
    $and: [
      { $or: [{ userRole: 'Reseller' }, { userRole: 'Qarz' }] },
      {
        $or: [
          { userName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      }
    ]
  }

  try {
    totalItems = await User.find(searchDB).countDocuments();

    const getDocs = await User
      .find(searchDB)
      .limit(limit)
      .skip(skip)
      .select({ __v: 0, password: 0, token: 0 });

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found ",
      });
    }

    res.status(200).json({ userDetail: getDocs, total: totalItems });

  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.userDetial = async (req, res) => {
  try {
    const getDoc = await User.
      findOne({ _id: req.params.Id })

      // findById(req.params.Id)
      .select({ __v: 0, password: 0, token: 0, _id: 0 });


    if (!getDoc) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    res.status(200).json({ userDetail: getDoc });

  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
