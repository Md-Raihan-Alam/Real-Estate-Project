import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaParking, FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import Contact from "../components/Contact";
const Listing = () => {
  const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setLising] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(
          `http://localhost:4000/api/listing/get/${params.listingId}`
        );

        if (response.data.success == false) {
          setError(true);
          setLoading(false);
          return;
        }
        setLoading(false);
        console.log(response.data);
        setLising(response.data);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation={true}>
            {listing.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${image}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? Number(listing.discountPrice).toLocaleString("en-US")
                : Number(listing.regularPrice).toLocaleString("en-US")}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : `${listing.bedrooms} Bedroom`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bathrooms`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? `Parking spot` : `No Parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished > 1 ? `Furnished` : `Not Furnished`}
              </li>
            </ul>
            {/* {currentUser && listing.userRef!==currentUser._id && !contact && ( */}
            <button
              onClick={() => setContact(true)}
              className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3"
            >
              Contact Landlord
            </button>
            {/* )} */}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
