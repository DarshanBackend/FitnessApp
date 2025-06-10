import express from 'express';
import { changePassword, forgotPassword, loginUser, logoutUser, resetPassword, VerifyEmail } from '../controllers/loginController.js';
import { TrainerAuth } from '../middlewares/auth.js';

const loginRouter = express.Router();

loginRouter.post('/loginUser', loginUser);
loginRouter.post('/forgotPassword', forgotPassword);
loginRouter.post('/VerifyEmail', VerifyEmail);
loginRouter.post('/resetPassword', resetPassword);
loginRouter.post('/changePassword/:id', TrainerAuth, changePassword);
loginRouter.post('/logoutUser', TrainerAuth, logoutUser);


export default loginRouter; 