'use strict';

import jwt from 'jsonwebtoken';

import Response from './response';
import models from "../database/models";

const { Users } = models;

class TokenVerification {

    //  User Token Verification.
    static userTokenValidation = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Users "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  Make sure that the respective User exists in the DB.
            const user = await Users.findOne({
                where: { id }
            });
            if (!user) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this user does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();

        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };


    //  Admin Token Verification.
    static adminTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Individual "id".
            const { id, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective user exists in the DB.
            const user = await Users.findOne({
                where: { id, role }
            });
            if (!user) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you don't have the privilege to perform this operation.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    }


    //  Bidder Token Verification.
    static bidderTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Individual "id".
            const { id, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Individual exists in the DB.
            const bidder = await Users.findOne({
                where: { id, role }
            });
            if (!bidder) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this bidder does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    }
    

    //  Driver Token Verification.
    static driverTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Punters "id".
            const { id, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Punter exists in the DB.
            const driver = await Users.findOne({
                where: { id, role }
            });
            if (!driver) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this driver does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };


    //  Other Token Verification.
    static others = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;

            //  TODO 1
            //  Get the User "id".

            //  TODO 2
            //  If Token exist, then make sure that the respective User exists in the DB.

            //  Now append the decoded token to the the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            return next();
        }catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };
}

export default TokenVerification;
