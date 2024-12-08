import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom";
import {Swiper,SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import "swiper/css/bundle";
const Listing = () => {
    SwiperCore.use([Navigation]);
    const params=useParams();
    const [listing,setLising]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await axios.get(`/api/listing/get/${params.listingId}`);
            
                if(response.data.success==false)
                {
                    setError(true);
                    setLoading(false);
                    return ;
                }
                setLoading(false);
                setLising(response.data);
            } catch (error) {
                setError(true);
                setLoading(false);
                console.log(error);
            }
            }
        fetchListing();
    },[params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong</p>}
      {listing && !loading && !error && (
        <>
        <Swiper navigation={true}>
            {listing.imageUrls.map((image,index)=>(
                <SwiperSlide key={index}>
                    <div className="h-[550px]" style={{background:`url(${image}) center no-repeat`,backgroundSize:"cover"}}></div>

                </SwiperSlide>
            ))}
        </Swiper>
        </>
      )}
    </main>
  )
}

export default Listing
