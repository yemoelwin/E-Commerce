import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { dbConnect } from "./config/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";
import categoryRoute from "./routes/productCategoryRoute.js";
import blogCategoryRoute from "./routes/blogCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import couponRoute from "./routes/couponRoute.js";
import colorRoute from "./routes/colorRoute.js";
import inquiryRoute from "./routes/inquiryRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import stripeRoute from "./routes/stripeRoute.js";

config();

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
	express.json({
		verify: (req, res, buffer) => (req["rawBody"] = buffer),
	}),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(cors());
app.use(
	cors({
		origin: "http://localhost:3000", // Update this to your frontend URL
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // Enable cookies if needed
	}),
);
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/blogCategory", blogCategoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
app.use("/api/inquiry", inquiryRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/stripe", stripeRoute);
app.use(errorHandler.pageNotFound);
app.use(errorHandler.handleError);

const PORT = process.env.PORT || 4000;

dbConnect()
	.then(() => {
		// Start your Express server once the database connection is successful
		app.listen(PORT, () => {
			console.log(`Server is running at PORT ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Application failed to start:", error);
	});
