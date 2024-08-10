import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "../config/db.js";
import userRouter from "../routes/userRoutes.js";
import adminRouter from "../routes/adminRoutes.js";
import sellerRouter from "../routes/sellerRoutes.js";
import cookieParser from "cookie-parser";
import paymentRouter from "../routes/paymentRoutes.js";
// import currentUserRouter from "../routes/currentUserRoutes.js";
import passport from 'passport';
import session from 'express-session';
import passportConfig from '../config/passport.js';
import authRouter from "../routes/authRouter.js";


const app = express();
const port = process.env.PORT || 3000;
connect();
const corsOptions = {
  origin: ["http://localhost:5174","https://fashion-oasis-frontend.vercel.app","http://localhost:5555"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};



app.use(
  session({
    secret: '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',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);




dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", sellerRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/auth/", authRouter);



// app.use("/api/v1",currentUserRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
