import express from 'express';
import { createMemberDetails, getAllMemberDetails, getMemberDetailsById, updateMemberDetails, deleteMemberDetails, getMemberProfileById } from '../controllers/memberController.js';
import { TrainerAuth, isAdmin } from '../middlewares/auth.js';

const MemberDetailsRouter = express.Router();

MemberDetailsRouter.post('/createMemberDetails', TrainerAuth, isAdmin, createMemberDetails);
MemberDetailsRouter.get('/getMemberDetailsById/:id', TrainerAuth, getMemberDetailsById);
MemberDetailsRouter.get('/getAllMemberDetails', TrainerAuth, isAdmin, getAllMemberDetails);
MemberDetailsRouter.put('/updateMemberDetails/:id', TrainerAuth, isAdmin, updateMemberDetails);
MemberDetailsRouter.delete('/deleteMemberDetails/:id', TrainerAuth, isAdmin, deleteMemberDetails);
MemberDetailsRouter.get('/getMemberProfileById/:id', TrainerAuth, getMemberProfileById);

export default MemberDetailsRouter;
