import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFailure,
  updateuserSuccess,
  updatUserStart,
} from "../redux/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  
  const [userListings,setUserListings]=useState();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  // const [fileError, setFileError] = useState("");
  const [showListingerror,setShowListingError]=useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

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
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChage = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart);
      const {data} = await axios.get(`https://real-estate-project-server.onrender.com/api/auth/signout`);
     
      if (data.success === false) {
        dispatch(signoutUserFailure(response.data));
        return;
      }
      dispatch(signoutUserSuccess);
    } catch (error) {
      dispatch(
        signoutUserFailure(error.response?.data?.message || error.message)
      );
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `https://real-estate-project-server.onrender.com/api/user/delete/${currentUser._id}`
      );
      if (response.data.success === false) {
        dispatch(deleteUserFailure(response.data.message));
        return;
      }
      dispatch(deleteUserSuccess(response.data));
    } catch (error) {
      dispatch(
        deleteUserFailure(error.response?.data?.message || error.message)
      );
    }
  };
  const handleShowListings=async()=>{
    try{
      const {data}=await axios.get(`https://real-estate-project-server.onrender.com/api/user/listings/${currentUser._id}`);
      if(data.success===false)
      {
        setShowListingError(true);
        return ;
      }
      setShowListingError(false);
      setUserListings(data);
      console.log(data);
    }catch(error)
    {
      console.log(error);
      setShowListingError(true);
    }
   
  }
  const handleListingDelete=async(id)=>{
    try{
      const {data}=await axios.delete(`https://real-estate-project-server.onrender.com/api/listing/delete/${id}`);
      if(data.success!==true)
      {
        console.log(data.message);
        return;
      }
      setUserListings(userListings.filter(listing=>listing._id!==id));
    }catch(error)
    {
      console.log(error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updatUserStart());

      const response = await axios.post(
        `https://real-estate-project-server.onrender.com/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateuserSuccess(response.data));

      setUpdateSuccess(true);
    } catch (error) {
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt={currentUser.username}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Successfully Uploaded!</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChage}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChage}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChage}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rouned-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5 ">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 ">
        {updateSuccess ? "Profile successfully updated" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{
        showListingerror ? "Error showing listings":""
        }
      </p>

      {userListings && userListings.length >0 && 
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-sembold">Your Listings</h1>
      {userListings.map((listing)=>(
        <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-17 object-contain rounded-lg"/>
          </Link>
          <Link className="flex-1 text-slate-700 font-semibold  hover:underline truncate" to={`/listing/${listing._id}`}>
            <p className="text-bold">{listing.name}</p>
          </Link>
          <div className=" flex flex-col items-center">
            <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 hover:underline uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
            <button  className="text-green-700 hover:underline uppercase">Edit</button>
            </Link>
           
          </div>
        </div>
      ))}
      </div>
      }
    </div>
  );
}
