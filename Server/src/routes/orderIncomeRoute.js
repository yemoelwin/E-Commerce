import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { orderIncomeController } from "../controllers/orderIncomeCtrl.js";

const router = express.Router();

router.get(
	"/getMonthlyOrderIncome/:selectedYear",
	protect,
	isAdmin,
	orderIncomeController.getMonthlyOrderAndIncome,
);

router.get(
	"/getYearlyOrderIncome",
	protect,
	isAdmin,
	orderIncomeController.getYearlyOrderAndIncome,
);

export default router;
