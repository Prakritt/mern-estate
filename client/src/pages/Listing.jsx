import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import {FaBath, FaBed, FaChair, FaMapMarkedAlt, FaParking} from 'react-icons/fa'



function Listing() {
    const {id} = useParams();
    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(false);
    useEffect(()=>{
        const fetchListing = async()=>{
            try{
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/listing/${id}`)
                const data = await  res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return
                }
                setListing(data);
                setLoading(false);
                
            }catch(err){
                setError(true);
                setLoading(false);
            }
            
        }
        fetchListing();
    },[id])
    
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl text-red-700'>Something Went Wrong......</p>}
        {listing && !loading && !error && (
            (
                <div>   
                    <div className='w-full h-80'>
                        <img src={`${listing.imageUrls[0]}`} alt="listing_cover" className='w-full h-full object-cover ' />
                    </div>
                    <div className='p-4 max-w-5xl mx-auto'>
                        <div className='flex flex-col gap-3'>
                            <div className='flex gap-4'>
                                <h1 className='font-semibold text-2xl'>{listing.name} - ${listing.regularPrice} </h1>
                            </div>

                            <div className='flex gap-4 items-center'>
                                <FaMapMarkedAlt className='text-green-700'/>
                                <p>{listing.address}</p>

                            </div>

                            <div className='flex gap-4'>
                                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded md'>
                                    {listing.type ==='rent' ? 'For Rent' : 'For Sale'}
                                </p>
                                {
                                    listing.offer && (
                                        <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                            ${+listing.regularPrice- +listing.discountPrice}
                                        </p>
                                    )
                                }
                            </div>
                            <p className='text-justify text-slate-800'><span className='font-semibold'>Description - </span>{listing.description}</p>
                            <ul className='text-green-900 font-semibold text-sm flex gap-4 sm:gap-6 items-center'>
                                <li className='flex gap-2 items-center'>
                                    <FaBed className='text-lg '/>
                                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                                </li>
                                <li className='flex gap-2 items-center'>
                                    <FaBath className='text-lg '/>
                                    {listing.bedrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                                </li>
                                <li className='flex gap-2 items-center'>
                                    <FaParking className='text-lg '/>
                                    {listing.parking  ? 'Parking' : 'No Parking'}
                                </li>
                                <li className='flex gap-2 items-center'>
                                    <FaChair className='text-lg '/>
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                                
                            </ul>
                            
                        </div>
                    </div>
                </div>
               
        
            )
        )}
    </main>
  )
}

export default Listing