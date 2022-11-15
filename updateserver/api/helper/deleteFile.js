const path = require('path')
const fs = require('fs')

exports.deleteimg = ((req, res) => {

    resolvePath = path.resolve(__dirname, '../../')
    absPath = path.join(resolvePath, 'uploads')
    filePath = absPath + '/' + req.params.Id

    fs.unlink(filePath, (e) => {
        if (e)
            return res.status(400).json({
                message: "bad Request"
            })

        res.status(200).json({
            message: "File has been deleted"
        })

    })

})

