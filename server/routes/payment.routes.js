import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { processPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/pay", isAuth, processPayment);

export default paymentRouter;