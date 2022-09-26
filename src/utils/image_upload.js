'use strict';

import multer from 'multer';
import path from "path";
import Response from './response';


// Multer Storage Method.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + '_' + 'profile_photo' + path.extname(file.originalname));
    }
});


// Multer File Filter.
const profileFilter = (req, file, callback) => {
    //  Get the File Extension name.
    const extName = path.extname(file.originalname).toLowerCase();

    //  Allowed Extensions.
    if (extName === ".jpg" || extName === ".jpeg" || extName === ".png") {
        return callback(null, true);
    }
    return callback({ message: 'Error; Please select JPG, JPEG or PNG images only.' }, false);
} ;

// Multer File Filter.
/**
    const videoFilter = (req, file, callback) => {
        //  Get the File Extension name.
        const extName = path.extname(file.originalname).toLowerCase();

        //  Allowed Extensions.
        if (extName === ".mp4" || extName === ".avi" || extName === ".mkv") {
            return callback(null, true);
        }
        return callback({ message: 'Error; Please select MP4, AVI or MKV videos only.' }, false);
    } ;
*/



/**
 * For User Profile Picture.
*/
// Multer Object.
const userUpload = multer({ 
    storage: storage,
    fileFilter: profileFilter,
    limits: {fileSize: 1000 * 1000},
}).single('profilePicture');

//  Uploading User Profile Image Function.
const userProfilePictureUpload = (req, res, next) => {
    userUpload(req, res, (error) => {
        if(error) {
            const response = new Response(
                false,
                400,
                (error.message) ? `Error: ${error.message}` : error
            );
            return res.status(response.code).json(response);
        }
        return next();
    });
}

export { userProfilePictureUpload  };
