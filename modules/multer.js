const multer = require('multer')

// function makeid (length) {
//   var result = ''
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   var charactersLength = characters.length
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR)
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-')
//     cb(null, makeid(16) + '_' + fileName)
//     cb(null, Date.now()+'-'+file.originalname)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 2000000 }, // file size two milion bytes are allowed
//   fileFilter: function (req, file, cb) {
//    console.log(req);
//     // filter file when it is needed
//     const fileTypes = /json/;
//     const extName = fileTypes.test(path.extname(file.originalname));
//     file.originalname.toLowerCase();
//     const mimeType = fileTypes.test(file.mimetype);
//     if (extName && mimeType) {
//       cb(null, true);
//     } else {
//       cb("Error: only json is allowed");
//    }
// }
// })

const storage = multer.memoryStorage();
const uploadMem = multer({sorage: storage});

module.exports.send = (req, res, next) => {
  return uploadMem.single('file')(req, res, () => {
    if (!req.file) return res.json({ error: "invalidFiletype" })
    next()
  })
}
