import express from 'express'
import {google, signIn, signUp,signOut} from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup',signUp)
router.post('/signin',signIn)
router.post('/google',google)
router.get('/signOut',signOut);

export default router;