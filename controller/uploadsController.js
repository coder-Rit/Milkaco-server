const path = require("path");
const multer = require("multer");
const catchAsyncErorr = require("../middleware/catchAsyncErorr");
 


var storage_img = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "Images");
  },
  filename: function (req, file, cb) {
    cb(null, req.params.imgName + ".jpg");
  },
});

var storage_vid = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "Videos");
  },
  filename: function (req, file, cb) {
    cb(null, req.params.vidName + ".mp4");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize_img = 1 * 1000 * 1000;

const uploadRemand = (filename,storageType,maxSize,allowdTypes) => {
  return multer({
    storage: storageType,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      // Set the filetypes, it is optional
    //   var filetypes = /jpeg|jpg|png/;
      var filetypes = allowdTypes;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
      );
    },

    // mypic is the name of file attribute
  }).single(filename);
};

 





// update Product api
// updateProduct_payload_JOSN = "https://backend-url/Product/:id"
exports.uploadImage = catchAsyncErorr(async (req, res, next) => {

  const upload = uploadRemand(req.params.vidName);
  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).json({
        msg: "Video Uploaded",
      });
    }
  });
});


exports.uploadVideo = catchAsyncErorr(async (req, res, next) => {

 const upload = uploadRemand(req.params.imgName);
  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).json({
        msg: "Image Uploaded",
      });
    }
  });
});
