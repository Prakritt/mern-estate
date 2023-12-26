import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

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