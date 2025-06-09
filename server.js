import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import registerRouter from "./src/routes/registerRoutes.js";
import loginRouter from "./src/routes/loginRoutes.js.js";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());


//register Routes
app.use("/api/register", registerRouter)

//loginRoutes
app.use("/api/login", loginRouter)


// Connect to Database
connectDB();

// Server Connection
app.listen(port, () => {
  console.log(`Server Start At Port http://localhost:${port}`);
});
