var multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({

    destination:(req,file,path)=>{
        path(null,'public/images')
    },

    filename:(req,file,path)=>
    {
        var ext = file.originalname.substring(file.originalname.lastIndexOf("."))
        var fn = `${uuidv4()}${ext}`
        path(null,fn)
    }
})

var upload = multer({storage:storage})

module.exports = upload;