'use strict';

import { Router } from 'express';

//  Import all the required routes.
import userRouter from "./user_routes";
import otpRouter from "./otp_routes";



//  Initialize Express Router.
const router = Router();

router.use('/users', userRouter);
router.use('/otp', otpRouter);

export default router;
