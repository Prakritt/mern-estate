import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import {signInStart,signInSuccess,signInFailure} from './../redux/user/user.slice';

export default function SignIn() {
  const dispatch = useDispatch();
  const [formData,setFormData] = useState({})
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id] : e.target.value})
  }

  const handleSignIn =async(e)=>{
    e.preventDefault();
    dispatch(signInStart())
    const{email,password} = formData;
    const loginData = {email,password}
    console.log(loginData)
    console.log(email,password);
    try{
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
  
      })
      const data = await res.json()
      if(data.success == false){
        dispatch(signInFailure(data.message))
        return 
      }
      dispatch(signInSuccess(data))
      navigate('/about')

    }catch(error){
      dispatch(signInFailure(error.message))
    }

  }

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-center text-slate-700 text-4xl font-bold my-3'>Sign In</h1>
      <form className="flex flex-col gap-4">
        <input onChange={handleChange} id="email" type="text" placeholder='john@example.com' className='p-3 rounded-lg' />
        <input onChange = {handleChange} id="password" type="password" placeholder='********' className='p-3 rounded-lg' />
        <button disabled={loading} onClick={handleSignIn} className='bg-slate-700 text-slate-100 rounded-lg p-3 hover:opacity-95 disabled:opacity-80' >Sign In</button>
      </form>
      <div className='flex gap-2 my-2'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-red-600'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}
