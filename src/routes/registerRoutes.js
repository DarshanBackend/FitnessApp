import express from 'express';
import {
    createRegister,
    getRegisterById,
    getAllRegister,
    updateRegister,
    deleteRegister
} from '../controllers/registerController.js';
import upload, { convertJfifToJpeg } from '../middlewares/imageupload.js';

const registerRouter = express.Router();

registerRouter.post('/createRegister', createRegister);
registerRouter.get('/getRegisterById/:id', getRegisterById);
registerRouter.get('/getAllRegister', getAllRegister);
registerRouter.put('/updateRegister/:id', upload.single("trainer_image"), convertJfifToJpeg, updateRegister);
registerRouter.delete('/deleteRegister/:id', deleteRegister);


export default registerRouter; 