import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500 uppercase">real</span>
            <span className="text-slate-700 uppercase">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 flex items-center p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700  curosr-pointer hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 curosr-pointer  hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser.user.avatar}
                className="rounded-full h-7 w-7 object-cover"
                alt="Profile"
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className=" text-slate-700  curosr-pointer hover:underline">
                Sign in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
