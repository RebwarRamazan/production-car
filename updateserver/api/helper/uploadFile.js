const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/'

    if (!fs.existsSync(dir))
      fs.mkdirSync(dir)

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg')
      fname = (new Date().toISOString() + '.jpeg').replace(/:/g, '-');
    else if (file.mimetype === 'image/png')
      fname = (new Date().toISOString() + '.png').replace(/:/g, '-');
    else
    fname = (new Date().toISOString() + '.mp4').replace(/:/g, '-');

      cb(null,fname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize:  10240000 * 590000,
    fieldSize : 10240000
  },
  fileFilter: fileFilter
})
.fields([{
  name: 'Pictureandvideodamage',
  maxCount: 11
}, {
  name: 'Pictureandvideorepair',
  maxCount: 11
},
{
  name: 'CarDamage',
  maxCount: 11
}
]);

module.exports = upload
