import express from 'express';
import { createListing,deleteListing,updateListing,getListing,getUserDetails} from '../controller/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.get('/:id',getListing);
router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/getUser/:userId',verifyToken,getUserDetails);

export default router;