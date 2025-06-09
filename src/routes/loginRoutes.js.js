import express from 'express';
import { changetrainerPassword, forgottrainerPassword, loginTrainer, logoutTrainer, resetPassword, VerifyEmail } from '../controllers/loginController.js';
import { TrainerAuth } from '../middlewares/auth.js';

const loginRouter = express.Router();

loginRouter.post('/loginTrainer', loginTrainer);
loginRouter.post('/forgottrainerPassword', TrainerAuth, forgottrainerPassword);
loginRouter.post('/VerifyEmail', TrainerAuth, VerifyEmail);
loginRouter.post('/resetPassword', TrainerAuth, resetPassword);
loginRouter.post('/changetrainerPassword/:id', TrainerAuth, changetrainerPassword);
loginRouter.post('/logoutTrainer', TrainerAuth, logoutTrainer);


export default loginRouter; 