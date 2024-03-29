import React from "react";
import { Link } from "react-router-dom";
import "./Intro.css";
import { FaChevronRight } from "react-icons/fa";

function Intro() {
  return (
    <div className="flex h-full bg-[#141e2f] text-white">
      <div className="container mx-auto ">
        <section className=" h-[100vh]  overflow-hidden flex sm:flex-row flex-col items-center justify-evenly">
          <div className="flex justify-around  ">
            <div className="flex flex-col  ">
              {/* <div className="flex font-extrabold sm:text-9xl text-7xl username text-[#000000] mx-4 "> */}
              <div className="username">
                <span className="split-text" data-text="DEXTER">
                  DEXTER
                </span>
              </div>
              <div className="  flex flex-col ">
                <div className=" font-extrabold m-4 mx-5 text-[1rem] sm:text-3xl profileName  ">
                  <h1>Full Stack Web Developer.</h1>
                </div>
                <span className="m-1 mx-5 font-extrabold font-serif text-[1.2rem]">
                  ReactJS | NodeJS | Blockchain Developer
                </span>
                <div className="m-4 mx-5 font-mono text-2xl ">
                  A cyber nerd trying to fix bits in network
                </div>
              </div>
            </div>
          </div>
          <div className="profile p-10  hidden lg:block rounded-full">
            <img src="chain.gif" alt="missed it!" className="rounded-full" />
          </div>
          <div className="absolute bottom-7 mb-7 flex justify-center ">
            <Link
              to="/about"
              className="flex p-2 items-center rounded-full font-extrabold text-2xl  text-black bg-[#ecff97] animate "
            >
              <FaChevronRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Intro;
