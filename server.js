import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import registerRouter from "./src/routes/registerRoutes.js";
import loginRouter from "./src/routes/loginRoutes.js.js";
import measurementInfoRouter from "./src/routes/measurementInfoRoutes.js";
import WaisttoHipRatioRouter from "./src/routes/WaisttoHipRatioRoutes.js";
import vo2MaxRockPortTestRouter from "./src/routes/Vo2MaxRockPortTestRoutes.js";
import cardiovascularRouter from "./src/routes/Cardiovascularroutes.js";
import muscularEndurancePushUPRouter from "./src/routes/MuscularEndurancePushUPRoutes.js";
import muscularEnduranceCrunchRouter from "./src/routes/MuscularEnduranceCrunchRoutes.js";
import muscularStrengthRouter from "./src/routes/MuscularStrengthRoutes.js";
import flexiblitiyRouter from "./src/routes/FlexiblitiyRoutes.js";
import dietRouter from "./src/routes/dietRoutes.js";
import workoutRouter from "./src/routes/workoutRoutes.js";
import leaveRouter from "./src/routes/leaveRoutes.js";
import MemberDetailsRouter from "./src/routes/memberRoutes.js";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());


//register Routes
app.use("/api/register", registerRouter)

//loginRoutes
app.use("/api/login", loginRouter)

// MeasurementInfo Routes
app.use("/api/measurementinfo", measurementInfoRouter);

// WaisttoHipRatio Router
app.use("/api/waisttoHipRatio", WaisttoHipRatioRouter)

//vo2MaxRockPortTest Router
app.use("/api/vo2MaxRockPortTest", vo2MaxRockPortTestRouter)

//cardiovascular Router
app.use("/api/cardiovascular", cardiovascularRouter)

//muscularEndurancePushUP Router
app.use("/api/muscularEndurancePushUP", muscularEndurancePushUPRouter)

//muscularEnduranceCrunch Router
app.use("/api/muscularEnduranceCrunch", muscularEnduranceCrunchRouter)

//muscularStrength Router
app.use("/api/muscularStrength", muscularStrengthRouter)

//flexiblitiy Router
app.use("/api/flexiblitiy", flexiblitiyRouter)

//diet Router
app.use("/api/diet", dietRouter)

//workout Router
app.use("/api/workout", workoutRouter)

//leave Router
app.use("/api/leave", leaveRouter)

//member Routes
app.use("/api/memberDetails", MemberDetailsRouter)

// Connect to Database
connectDB();

// Server Connection
app.listen(port, () => {
  console.log(`Server Start At Port http://localhost:${port}`);
});
