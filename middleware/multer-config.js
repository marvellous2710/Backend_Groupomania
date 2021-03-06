const multer = require('multer');


const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpg',
    'image/png' : 'png',
    'image/gif' : 'gif',
    'image/webp': 'webp',
}

const storage = multer.diskStorage({
    
    destination: (req, file, callback) => { //montre où les images vont
        callback(null, 'images');      
    },
    filename: (req, file, callback) => {        
        const name = file.originalname.split(' ').join('_');       
        const extension = MIME_TYPES[file.mimetype];       
        callback(null, name + Date.now() + '.' + extension);
        console.log(req, file)
    },
});


 module.exports = multer({storage: storage}).single('image');


