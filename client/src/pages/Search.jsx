import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components /ListingItem';

function Search() {
    const [sidebarData,setSideBarData] = useState({
        searchTerm : '',
        type : 'all',
        parking : false,
        furnished : false,
        offer : false,
        sort : 'created_at',
        order : 'desc'
    })
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const[listings,setListings] = useState([]);

    console.log(listings)

    const handleChange = (e)=>{

        if(e.target.id === 'all'|| e.target.id === 'rent' || e.target.id === 'sale'){
            setSideBarData({...sidebarData,type : e.target.id })
        }
        if(e.target.id ==='searchTerm'){
            setSideBarData({
                ...sidebarData,[e.target.id]:e.target.value
            })
        }
        if(e.target.id ==='parking'||e.target.id ==='furnished'||e.target.id ==='offer'){
            setSideBarData({
                ...sidebarData,[e.target.id] : e.target.checked || e.target.checked ==='true'?true : false
            })
        }
        if(e.target.id ==='sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({
                ...sidebarData, sort,order
            })
        }
    }

    useEffect(()=>{

        const urlParams = new URLSearchParams(location.search);
        const term = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        


        if(term||
            typeFromUrl||
            parkingFromUrl||
            furnishedFromUrl||
            offerFromUrl ||
            sortFromUrl||
            orderFromUrl){
                setSideBarData({
                    searchTerm : term || '',
                    type : typeFromUrl || 'all',
                    parking : parkingFromUrl === 'true'?true:false,
                    furnished : furnishedFromUrl === 'true'?true:false,
                    offer : offerFromUrl === 'true'?true:false,
                    sort : sortFromUrl || 'created_at',
                    order : orderFromUrl || 'desc'

                });
            }
            console.log("sort",sidebarData.sort)

            const fetchListings = async()=>{
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing?${searchQuery}`)
                const data = await res.json()
                setListings(data);
                setLoading(false);
            }
            fetchListings();


    },[location.search])

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('type',sidebarData.type)
        urlParams.set('parking',sidebarData.parking)
        urlParams.set('furnished',sidebarData.furnished)
        urlParams.set('offer',sidebarData.offer)
        urlParams.set('sort',sidebarData.sort)
        urlParams.set('order',sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)

    }

    
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2
        md:min-h-screen 
        ">
            <form onSubmit = {handleSubmit}className='flex flex-col gap-8'>
                <div className="flex items-center gap-2 ">
                    <label className='font-semibold whitespace-nowrap'>Search Term:</label>
                    <input onChange={handleChange} 
                    value={sidebarData.searchTerm}
                    type="text" 
                    id="searchTerm"
                    placeholder='Search...'
                    className='border rounded-lg p-3 w-full'

                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold' >Type:</label>
                    <div className="flex gap-2">
                        <input 
                        onChange={handleChange} 
                        checked = {sidebarData.type === 'all'}
                        type="checkbox" id="all" className='
                        w-5 ' />
                        <span>Rent & Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className='
                        w-5 ' 
                        onChange={handleChange} 
                        checked={sidebarData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className='
                        w-5 '
                        onChange={handleChange} 
                        checked={sidebarData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className='
                        w-5 '
                        onChange={handleChange} 
                        checked={sidebarData.offer === true }
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold'>Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className='
                        w-5 ' 
                        onChange={handleChange} 
                        checked={sidebarData.parking === true}
                        />
                        <span>Parking</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className='
                        w-5 ' 
                        onChange={handleChange} 
                        checked={sidebarData.furnished === true}/>
                        <span>Furnished</span>
                    </div>


                </div>
                <div className="flex items-center gap-2">
                    <label className='font-semibold'>Sort: </label>
                    <select id="sort_order" 
                    className='border rounded-lg p-3'
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    >
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white
                p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results: </h1>
            <div className="p-7 flex flex-wrap gap-4">

                {!loading && listings.length === 0 && (
                    <p className='text-xl text-center text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-4'>Loading...</p>
                )}
                {
                    !loading && listings && listings.map((listing)=>(
                        <ListingItem key={listing._id} listing={listing}/>
                    ))
                }

            </div>
        </div>
    </div>
  )
}

export default Search