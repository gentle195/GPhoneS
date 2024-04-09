import express from 'express';
import { addChuyenMuc, deleteChuyenMuc, getAllChuyenMuc  } from '../controllers/ChuyenMuc';

const router = express.Router();

router
    .post('/', addChuyenMuc)
    .get('/', getAllChuyenMuc)

    .delete('/:id', deleteChuyenMuc)


export default router;