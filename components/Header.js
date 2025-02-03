import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

import { BsFillKeyboardFill } from "react-icons/bs";

import { auth } from "../firebase/firebase";

const Header = ({ isShow }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [dropMenu, setDropMenu] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <header>
      <nav className="navbar">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img
            className="logo"
            onClick={() => router.push("/")}
            src="https://i.postimg.cc/W1PwRj4j/logo.png"
            alt="TokTik"
          />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="nav-right"
        >
          {isShow && (
            <>
              {user && (
                <button
                  onClick={() => router.push("/pin/create")}
                  type="button"
                  className="flex items center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Upload
                </button>
              )}
            </>
          )}
          {user ? (
            <div className="flex items-center">
              <img
                src={user?.photoURL}
                className="rounded-full w-10 cursor-pointer"
                alt="Avatar"
              />
              {/*   <p>{user?.displayName}</p> */}
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => router.push("/auth/signin")}
            >
              Log in
            </button>
          )}
          <div className="drop-down">
            {dropMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => setDropMenu(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => setDropMenu(true)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            )}
            {dropMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="menu z-[999]"
              >
                <ul>
                  {user ? (
                    <li>
                      <div
                        className="flex items-center px-3 gap-4"
                        onClick={logout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                          />
                        </svg>
                        Log Out
                      </div>
                    </li>
                  ) : (
                    <li>
                      <div
                        className="flex items-center px-3 gap-4"
                        onClick={() => router.push("/auth/signin")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                          />
                        </svg>
                        Log In
                      </div>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
