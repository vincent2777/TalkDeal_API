"use strict";

import jwt from "jsonwebtoken";
import bCrypt from "bcryptjs";
import otpGenerator from 'otp-generator';
import models from "../database/models";
import JoiValidator from "../utils/joi_validator";
import Response from "../utils/response";
import SendOTPMail from "../utils/send_otp_mail";

const { Users, OTP } = models;

class UsersController {

    //  Users SignUp.
    static signUpUser = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.usersSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if User already exist and create a new Users.
            const [user, created] = await Users.findOrCreate({
                where: { email: value.email },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "User already registered. Kindly login with your credentials."
                );
                return res.status(response.code).json(response);
            }
            const { name, email } = user;

            // Generate a Six digits token.
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            console.log("GEN OTP::: ", otp);

            //  Save OTP to the DB
            await OTP.create({
                userEmail: value.email,
                otp: otp,
            });


            //  Send OTP to users mail.
            // await SendOTPMail.sendMail(name, email, otp);
            const emailResponse = await SendOTPMail.sendMail(name, email, otp);
            console.log("EMAIL RESPONSE::: ", emailResponse);


            const response = new Response(
                true,
                201,
                "Successfully registered. Kindly check your email for your OTP.",
                user
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  User Login.
    static loginUser = async (req, res) => {
        try {
            const requestBody = req.body;
            console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.usersLoginSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Find the user.
            const user = await Users.findOne({
                where: { email: value.email },
            });
            if (!user) {
                const response = new Response(
                    false,
                    404,
                    "Incorrect email. Please check your email and try again."
                );
                return res.status(response.code).json(response);
            }
            const { id, name, email, phone, role } = user;

            //  Compare the encrypted password.
            const isPasswordMatched = bCrypt.compareSync(value.password, user.password);
            if (!isPasswordMatched) {
                const response = new Response(
                    false,
                    401,
                    "Incorrect password. Please check your password and try again."
                );
                return res.status(response.code).json(response);
            }

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            //  Now remove the "password" before returning the User.
            const userDataValues = user.dataValues;
            delete userDataValues.password;
            delete userDataValues.pictureId;

            //  Check if user is verified.
            /*if (user.isVerified === false) {
                const response = new Response(
                    true,
                    200,
                    "Account is not verified. Kindly check your email for your OTP.",
                    { ...userDataValues, token }
                );
                return res.status(response.code).json(response);
            }*/

            const response = new Response(
                true,
                200,
                "You're logged in successfully.",
                { ...userDataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Users.
    static getAllUsers = async (req, res) => {
        try {
            const users = await Users.findAll({
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!users.length) {
                const response = new Response(
                    false,
                    404,
                    "No user found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Users retrieved successfully.',
                users
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Bidders.
    static getAllBidders = async (req, res) => {
        try {
            const bidders = await Users.findAll({
                where: {role: "Bidder"},
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!bidders.length) {
                const response = new Response(
                    false,
                    404,
                    "No bidder found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Bidders retrieved successfully.',
                bidders
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Bidders.
    static getAllDrivers = async (req, res) => {
        try {
            const drivers = await Users.findAll({
                where: {role: "Driver"},
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!drivers.length) {
                const response = new Response(
                    false,
                    404,
                    "No driver found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Drivers retrieved successfully.',
                drivers
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single User.
    static getSingleUser = async (req, res) => {
        try {
            const { id } = req.params;

            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!user) {
                const response = new Response(
                    false,
                    404,
                    "User does not exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'User retrieved successfully.',
                user
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Update a User.
    static updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.usersUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            if (value.email) {
                const foundUser = await Users.findOne({
                    where: { id }
                });

                //  First check if the user Email is changed, then resend verification mail.
                if (foundUser.email !== value.email) {
                    const updatedUser = await Users.update({ ...value, isVerified: false }, { where: { id } });
                    if (updatedUser[0] === 0) {
                        const response = new Response(
                            false,
                            400,
                            "Failed to update user."
                        );
                        return res.status(response.code).json(response);
                    }


                    //  Get the user back.
                    const user = await Users.findOne({
                        where: { id },
                        attributes: {
                            exclude: ["password"]
                        }
                    });
                    const { name, email, phone, role } = user;

                    // Generate a Six digits token.
                    const otp = otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });
                    console.log("GEN OTP::: ", otp);

                    //  Save OTP to the DB
                    await OTP.create({
                        userEmail: email,
                        otp: otp,
                    });


                    //  Send OTP to users mail.
                    await SendOTPMail.sendMail(name, email, otp);
                    // const emailResponse = await SendOTPMail.sendMail(name, email, otp);
                    // console.log("EMAIL RESPONSE::: ", emailResponse);


                    //  Create a Token that will be passed to the response.
                    const token = jwt.sign(
                        { id, name, email, phone, role },
                        `${process.env.JWT_SECRET_KEY}`,
                    );

                    const response = new Response(
                        true,
                        200,
                        "Successfully updated. Kindly check your email for your OTP verification.",
                        { ...user.dataValues, token }
                    );
                    return res.status(response.code).json(response);
                }

                //  If Not, then return.
                return;
            }

            const updatedUser = await Users.update({ ...value }, { where: { id } });
            if (updatedUser[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update user."
                );
                return res.status(response.code).json(response);
            }

            //  Get the user back.
            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            const { name, email, phone, role } = user;

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            const response = new Response(
                true,
                200,
                "Account updated successfully.",
                { ...user.dataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Delete a User.
    static deleteUser = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Users.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No user found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "User deleted successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Upload Users Profile Picture.
    static uploadUserProfilePicture = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const filename = req.file.filename;
            const avatarURL = `http://${req.headers.host}/uploads/${filename}`;
            console.log(req.file);

            //  Update the Users Profile Picture..
            const updatedUser = await Users.update(
                { picture: avatarURL },
                { where: { id } }
            );
            if (updatedUser[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update profile picture."
                );
                return res.status(response.code).json(response);
            }

            //  Get the user back.
            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            const { name, email, phone, role } = user;


            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            const response = new Response(
                true,
                200,
                'Successfully created a doctor.',
                { ...user.dataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error.message}`);

            const response = new Response(
                false,
                504,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };
}


export default UsersController;