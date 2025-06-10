import express from 'express';
import {
    createRegister,
    getRegisterById,
    getAllRegister,
    updateRegister,
    deleteRegister
} from '../controllers/registerController.js';
import upload, { convertJfifToJpeg } from '../middlewares/imageupload.js';
import { TrainerAuth, isAdmin } from '../middlewares/auth.js';

const registerRouter = express.Router();

registerRouter.post('/createRegister', createRegister);
registerRouter.get('/getRegisterById/:id', TrainerAuth, getRegisterById);
registerRouter.get('/getAllRegister', TrainerAuth, getAllRegister);
registerRouter.put('/updateRegister/:id', TrainerAuth, upload.single("trainer_image"), convertJfifToJpeg, updateRegister);
registerRouter.delete('/deleteRegister/:id', TrainerAuth, deleteRegister);


export default registerRouter; 