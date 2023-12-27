import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import ListingItem from '../components /ListingItem';
export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log('sale Listings',saleListings)
  useEffect(()=>{

    const fetchOfferListings = async()=>{
      try{
        const res = await fetch('/api/listing?offer=true&limit=4')
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();

      }catch(er){
        console.log(er)
      }
    }

    const fetchRentListings = async()=>{
      try{
        const res = await fetch('/api/listing?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings()
        

      }catch(er){
        console.log(er)
      }
    }

    const fetchSaleListings = async()=>{
      try{
        const res = await fetch('/api/listing?type=sale&limit=4')
        const data = await res.json();
        setSaleListings(data);
        

      }catch(er){
        console.log(er)
      }
    }


    
    fetchOfferListings()
  },[])
  return (
    <div>
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 
        className='text-slate-700 font-bold text-3xl lg:text-6xl'
        >Find your next <span className='text-slate-500'>perfect</span>
        <br/>place with ease..
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Real Estate has a wide range of property for you to choose from.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started
        </Link>
      </div>

      
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0  && (
          <div className="">
            <div className=" my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0  && (
          <div className="">
            <div className=" my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0  && (
          <div className="">
            <div className=" my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Sell</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show more places for Sell
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
