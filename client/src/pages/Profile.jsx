import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector(state=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className='rounded-full h-24 2-24 object-cover 
        cursor:pointer self-center mt-2' 
        src={currentUser.avatar} alt="User Avatar"/>
        <input id = "username" type="text"  placeholder='username' 
        className='border p-3 rounded-lg'/>
        <input id = "email" type="text"  placeholder='email' 
        className='border p-3 rounded-lg'/>
        <input id = "password" type="password"  placeholder='password' 
        className='border p-3 rounded-lg'/>
        <button className='uppercase bg-slate-700 
        text-slate-100 rounded-lg p-3 hover:opacity-95
        disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between my-3 text-red-700'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
