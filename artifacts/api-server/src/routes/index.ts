import { Router, type IRouter } from "express";
import healthRouter from "./health";
import otpRouter from "./otp";
import razorpayRouter from "./razorpay";
import ordersRouter from "./orders";
import stockRouter from "./stock";
import notifyRouter from "./notify";
import referralRouter from "./referral";
import flashsaleRouter from "./flashsale";
import chatRouter from "./chat";
import customerReviewsRouter from "./customerReviews";
import customersRouter from "./customers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(otpRouter);
router.use(razorpayRouter);
router.use(ordersRouter);
router.use(stockRouter);
router.use(notifyRouter);
router.use(referralRouter);
router.use(flashsaleRouter);
router.use(chatRouter);
router.use(customerReviewsRouter);
router.use(customersRouter);

export default router;
