import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const createListing = async(req,res,next)=>{

    try{

        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)


    }catch(error){
        next(error);
    }

}

export const deleteListing = async(req,res,next)=>{
    try{
        
        const listingId = req.params.id;
        const listing  = await Listing.findById(listingId);
        if(!listing){
            return next(errorHandler(404, 'Listing Not Found'));
        }
        if(req.user.id !== listing.userRef ){

            return next(errorHandler(401, 'You can only delete your own listing...'));

        }   
        

        await Listing.findByIdAndDelete(req.params.id);
        res.status(204).end();
    }
    catch(err){
        next(err);
    }
}

export const updateListing = async( req,res,next)=>{
    try{

        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'Listing not found..'))
        }

        if(listing.userRef !== req.user.id){
            return next(errorHandler(401,'You can only update your own listing'))
        }

        const updated_listing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updated_listing);

    }catch(err){
        next(err)
    }
}

export const getListing = async (req,res,next)=>{
    try{

        const listing = await Listing.findById(req.params.id);
        if(!listing){
            next(errorHandler(404,'Listing Not Found'))
        }
        res.status(200).json(listing);

    }catch(error){
        next(error);
    }
}

export const getUserDetails = async(req,res,next)=>{
    try{
        const userRef = req.params.userId;
        console.log('userRef',userRef)
        const user = await User.findById(userRef);
        
        console.log(user)
        if(!user){
            next(errorHandler(404,'User not Found!!'))
        }
        const {password,...rest} = user._doc;
        res.status(200).json(rest)

    }catch(error){
        next(error)
    }
}

export const getAllListings = async(req,res,next)=>{

    try{
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = { $in : [false,true]}
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = { $in : [false,true]}
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = { $in : [false,true]}
        }

        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = { $in : ['rent','sale']}
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name : {$regex : searchTerm, $options : 'i'},
            offer,
            furnished,
            parking,
            type

        }).sort({[sort]:order}).limit(limit).skip(startIndex);

        res.status(200).json(listings);


        

    }catch(err){
        next(err)
    }

}