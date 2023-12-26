import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom';

function Contact({listing}) {
    const [landLord,setLandLord] = useState(null);
    const [message,setMessage] = useState('')

    const handleChange = (e)=>{
        setMessage(e.target.value)
    }
    
    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                console.log(`/api/listing/getUser/${listing.userRef}`)
                const res = await fetch(`/api/listing/getUser/${listing.userRef}`);
                const data = await res.json();
                setLandLord(data);
            }catch(error){  
                console.log(error)
            }
            
        }
        fetchUser();
    },[listing.userRef])

  return (
    <div>
        {landLord && (
            <div className='flex flex-col gap-2'>
                <p className=''
                >Contact <span className='font-semibold'>{landLord.username}</span> for <span
                className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea 
                className='w-full border p-3 rounded-lg' 
                placeholder='Enter your message here...'
                name="message" id="message" rows="2" calue = {message}
                onChange={handleChange}></textarea>
                <Link 
                className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                to={`mailto:${landLord.email}?subject=Regarding${listing.name}&body=${message}`}>Send Message</Link>
            </div>
        )}
    </div>
  )
}

export default Contact