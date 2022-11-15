
exports.isAdmin = (req, res, next) => { 

    (req.userData?.userId === 2211) ? next() : res.status(401).json({
        message: 'Authrization failed'

    });
}

exports.isReseller = (req, res, next) => {
    (req.userData?.userId === 2211 || req.userData?.userId === 1122) ? next() : res.status(401).json({
        message: 'Authrization failed',
    });
}

exports.isQarz = (req, res, next) => {
    (req.userData?.userId === 1212 || req.userData?.userId === 2211) ? next() : res.status(401).json({
        message: 'Authrization failed',
    });
}