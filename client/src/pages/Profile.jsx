import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRef } from 'react'

import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure,updateUserStart,updateUserSuccess,deleteUserStart,deleteUserFailure,deleteUserSuccess } from '../redux/user/user.slice';

export default function Profile() {
  const {currentUser,loading,error} = useSelector(state=>state.user)
  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined);
  const [fileUploadPerc, setFileUploadPerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  console.log(formData)
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])


  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>{
      const progress = snapshot.bytesTransferred/snapshot.totalBytes * 100
      setFileUploadPerc(Math.round(progress));}
    ,(err)=>{
      setFileUploadError(true)
    },()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      })
    })

  }

  const handleInputChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleFormSubmit = async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method : 'POST',
        headers :{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success == false){
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }
    catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async ()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : 'DELETE',
      })
      const data = await res.json();

      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    }catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>

        <input onChange={e => setFile(e.target.files[0])} type="file" ref = {fileRef} accept='image/*' hidden/>
        <img onClick={()=>fileRef.current.click()} 
        className='rounded-full h-24 2-24 object-cover 
        cursor:pointer self-center mt-2' 
        src={formData.avatar || currentUser.avatar} alt="User Avatar"/>
        <p className='text-sm text-center'>{fileUploadError?(<span className='text-red-700'>Image must be less tha 2MB</span>)
        :(fileUploadPerc>0 && fileUploadPerc<100)?(<span className='text-slate-600'>{`Uploading ${fileUploadPerc}%`}</span>)
        :(fileUploadPerc===100)?(<span className='text-green-700'>Image Upload Successful</span>):""
      }</p>
        <input id = "username" type="text"  placeholder='username' defaultValue={currentUser.username} onChange={handleInputChange}
        className='border p-3 rounded-lg'/>
        <input id = "email" type="text"  placeholder='email'  defaultValue={currentUser.email} onChange={handleInputChange}
        className='border p-3 rounded-lg'/>
        <input id = "password" type="password"  placeholder='password'  onChange={handleInputChange}
        className='border p-3 rounded-lg'/>

        <button disabled={loading} className='uppercase bg-slate-700 
        text-slate-100 rounded-lg p-3 hover:opacity-95
        disabled:opacity-80'>{loading?'Loading':'Update'}</button>

      </form>


      <div className='flex justify-between my-3 text-red-700'>

        <span onClick={handleDeleteUser} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>

      </div>
      <p className='text-red-700 mt-5'>
        {error? error:''}
      </p>
      <p className='text-green-700'>
        {updateSuccess?"User Successfully Updated":""}
      </p>
    </div>
  )
}
