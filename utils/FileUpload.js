const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{ //CB- CALL BACK
        cb(null,'content')
    },
    fileName: (req, file, cb )=>{ //convert the file name to handle the duplicacy of name
cb(null, Date.now() + path.extname(file.originalname))
    } 
})

//FUNCTION TO HANDLE THE UPLOAD THE PIC
const upload = multer({
    storage,
    limits:{fileSize: 100000*100},//AROUND 10MB
    fileFilter: (req, file, cb)=>{
        const fileTypes = /jpg|png|mp4|gif/;//SUPPORTED FILE TYPES
        
        // const mimeTypes = fileTypes.test(file.mimetype);
        // const extname = fileTypes.test(path.extname(file.originalname))
   
        // if(mimeTypes && extname){
        //     return cb(null, true)
        // }
    // cb('Only images supported')

    return cb(null, true)
    }
}).single('content');



module.exports = upload;