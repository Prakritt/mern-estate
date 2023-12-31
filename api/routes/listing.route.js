import express from 'express';
import { createListing,deleteListing,updateListing,getListing,getUserDetails, getAllListings} from '../controller/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.get('/:id',getListing);
router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/getUser/:userId',verifyToken,getUserDetails);
router.get('/',getAllListings);

export default router;