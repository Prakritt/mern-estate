import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/user.slice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadPerc, setFileUploadPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log(formData)
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPerc(Math.round(progress));
      },
      (err) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async (e) => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signOut");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success == false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    }
  };
  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const editListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 2-24 object-cover 
        cursor:pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="User Avatar"
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">Image must be less tha 2MB</span>
          ) : fileUploadPerc > 0 && fileUploadPerc < 100 ? (
            <span className="text-slate-600">{`Uploading ${fileUploadPerc}%`}</span>
          ) : fileUploadPerc === 100 ? (
            <span className="text-green-700">Image Upload Successful</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        />

        <button
          disabled={loading}
          className="uppercase bg-slate-700 
        text-slate-100 rounded-lg p-3 hover:opacity-95
        disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg
          uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between my-3 text-red-700">
        <span onClick={handleDeleteUser} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User Successfully Updated" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full text-center"
      >
        {" "}
        Show listings
      </button>
      {showListingsError && (
        <p className="text-red-700 text-sm">Error Showing Listings</p>
      )}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-center mt-7 text-2xl">
            Your Listings
          </h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="flex  justify-between items-center gap-3 border p-3"
              >
                <Link
                  className="flex  justify-between items-center gap-3  p-3 flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing Cover"
                    className="h-16 w-16 object-contain"
                  />
                  <p className="font-semibold flex-1 hover:underline truncate">
                    {listing.name}
                  </p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => editListing(listing._id)}
                    className="text-green-700 uppercase"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
