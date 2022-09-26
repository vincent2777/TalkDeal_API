'use strict';

import { Router } from 'express';
import UsersController from "../controllers/user_controller";
import TokenVerification from "../utils/token_verification";
import { userProfilePictureUpload } from "../utils/image_upload"

//  Set up Express Router.
const userRouter = Router();

//  Users SignUp.
userRouter.post(
    "/signup",
    UsersController.signUpUser
);

//  User Login.
userRouter.post(
    "/login",
    UsersController.loginUser
);

//  Get all Users.
userRouter.get(
    "/all_users",
    TokenVerification.userTokenValidation,
    UsersController.getAllUsers
);

//  Get all Audience.
userRouter.get(
    "/all_bidders",
    TokenVerification.userTokenValidation,
    UsersController.getAllBidders
);

//  Get all Punters.
userRouter.get(
    "/all_drivers",
    TokenVerification.userTokenValidation,
    UsersController.getAllDrivers
);

//  Get a single User.
userRouter.get(
    "/single_user/:id",
    TokenVerification.userTokenValidation,
    UsersController.getSingleUser
);

//  Update a User.
userRouter.put(
    "/update_user/:id",
    TokenVerification.userTokenValidation,
    UsersController.updateUser
);

//  Delete User.
userRouter.delete(
    "/delete_user/:id",
    TokenVerification.userTokenValidation,
    UsersController.deleteUser
);

//  Uploading Users Profile Picture.
userRouter.post(
    "/upload_user_picture",
    TokenVerification.userTokenValidation,
    userProfilePictureUpload,
    UsersController.uploadUserProfilePicture
);

export default userRouter;