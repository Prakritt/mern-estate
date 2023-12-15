import React from 'react'
import {Link} from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 '>
        <input id="username" type="text" placeholder='username' className='border p-3 rounded-lg'/>
        <input id="email" type="email" placeholder='abc@example.com' className='border p-3 rounded-lg'/>
        <input id="password" type="password" placeholder='*******' className='border p-3 rounded-lg'/>
        <button  className='disabled bg-slate-700 p-3 rounded-lg text-slate-100 uppercase hover:opacity-95 disabled:opacity-80 '>Sign Up</button>
      </form>
      <div className='flex gap-5 mt-5'>
        <p>Have an account?</p>
        <Link to ={"/sign-in"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
