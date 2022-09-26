'use strict';

import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator';
import models from "../database/models";
import Response from "../utils/response";
import SendOTPMail from "../utils/send_otp_mail";
import JoiValidator from "../utils/joi_validator";

const { OTP, Users } = models;


class OTPController {

    //  Send OTP.
    static sendOTPMail = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.otpSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            // Generate a Six digits token.
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: true,
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
                "OTP sent successfully. Kindly check your email for your OTP.",
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

    
    //  Verify OTP.
    static verifyOTP = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.verifyOTPSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }
            const { email, otp } = value;

            //  Find the user.
            const foundOTP = await OTP.findOne({
                where: { userEmail: email, otp },
            });
            console.log("VALIDATED::: ", foundOTP);
            if (foundOTP === null) {
                const response = new Response(
                    false,
                    400,
                    "The OTP is invalid, kindly request for an OTP."
                );
                return res.status(response.code).json(response);
            }
            // console.log("VALIDATED::: ", validatedOTP);

            //  Update the User "isVerified" property.
            const updatedUser = await Users.update({ "isVerified": true }, { where: { id , email } });
            if (updatedUser[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to verify your account."
                );
                return res.status(response.code).json(response);
            }

            //  Delete the Users OTP.
            await OTP.destroy({
                where: { userEmail: email }
            });

            //  Fetch the user.
            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password", "pictureId"]
                }
            });
            const { name, phone, role } = user;

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            const response = new Response(
                true,
                200,
                "Successfully verified your account.",
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
 }

 export default OTPController;