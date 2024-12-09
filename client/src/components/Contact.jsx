import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // For prop validation (optional)
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(null);
  const [message,setMessage]=useState(""); 
    const handleChange=(e)=>{
        setMessage(e.target.value);
    }
  useEffect(() => {
    const fetchLandlord = async () => {
      if (!listing?.userRef) return; // Ensure `userRef` exists
      console.log(listing.userRef);
      try {
        const response = await axios.get(`/api/user/${listing.userRef}`);
        setLandlord(response.data);
      } catch (error) {
        console.error("Error fetching landlord:", error);
        setError("Failed to load landlord details.");
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {landlord ? (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username} </span>for <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea name="message" id="message" rows="2" placeholder="Enter your message here..." className="w-full border p-3 rounded-lg" onChange={handleChange} value={message}></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">Send Message</Link>
        </div>
      ) : (
        !error && <p>Loading landlord details...</p>
      )}
    </>
  );
};

// PropTypes validation (if not using TypeScript)
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired, // Define as required or optional
    name: PropTypes.string.isRequired, // Add name to prop validation
  }).isRequired,
};

export default Contact;
