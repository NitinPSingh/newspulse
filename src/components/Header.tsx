import  { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom"; 
import useUser from "../hooks/useUser";

const Header = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentCountry, setCurrentCountry] = useState("India");
  const { profile } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => setCurrentCountry(data.country_name || "Global"))
      .catch(() => setCurrentCountry("India"));
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
  const closeDropdown = () => {
    setDropdownVisible(false)
  }

  const handleLogout = () => {
    closeDropdown()
    logout({ logoutParams: { returnTo: window.location.origin } });
    
    setDropdownVisible(false); 
  };

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-pulse border-pulse shadow sticky top-[0px] z-[100]">
      <div className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate("/")}>News Pulse</div>
      <div className="flex gap-2 items-center lg:block hidden">
      
        <div  > {currentCountry}</div>
       
        <div className="text-sm">
          {currentTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
      <div className="relative">
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            className="px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100"
          >
            Login/Signup
          </button>
        ) : (
          <div className="relative">
            <img
              src={user?.picture}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50">
                <div className="py-2 px-4 text-gray-700 border-b">
                  <span className="font-medium">{profile?.username}</span>
                </div>
                <ul className="text-sm text-gray-700">
                  <li>
                    <Link
                      to={`/profile/${profile?.username}`} 
                      className="block px-4 py-2 text-left text-black hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      <UserOutlined className="mr-2" /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/post/new" 
                      className="block px-4 py-2 text-left text-black hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      <EditOutlined className="mr-2" /> Create Post
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-black px-4 py-2 hover:bg-gray-100"
                    >
                      <LogoutOutlined className="mr-2" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
