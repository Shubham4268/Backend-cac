import multer from "multer";

// Different types of storage are available while uploading the files
// Buffer storage and diskstorage. Diskstorage stores files on local disk

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename : function( req, file, cb){
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})  