import React, { useEffect } from "react";
import { FaAngleLeft, FaEthereum } from "react-icons/fa";
import { FiGithub, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Project.css";
function Projects() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const projectItems = document.querySelectorAll(".projectItem");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          entry.target.classList.add("slideIn");
        } else {
          entry.target.classList.remove("slideIn");
        }
      });
    });

    projectItems.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const projects = [
    {
      id: 1,
      name: "Flix ",
      desc: "Flix is a netflix clone created using React and Firebase where users can watch trailers of all shows and movies. ",
      link: "https://netlifflix.netlify.app/",
      github: "https://github.com/dextey/Flix.git",
    },
    {
      id: 2,
      name: "Fakey",
      desc: "Fakey is a Dapp e-commerce website made with react, firebase and dolidity which is deplyed on Polygon Network.",
      link: "https://fakey.netlify.app/",
      github: "https://github.com/dextey/Fakey.git",
      web3: true,
    },
    {
      id: 3,
      name: "Cryto Funder",
      desc: "A funding Dapp in Goeril Network where users can fund ethereum  with ease and be listed in top funders.",
      link: "https://crypto-funder.vercel.app/",
      github: "https://github.com/dextey/crypto-funder.git",
      web3: true,
    },
    {
      id: 4,
      name: "Doit",
      desc: "A Productive app for handling task with react and firebase",
      github: "https://github.com/dextey/Doit.git",
      link: "",
    },
    {
      id: 5,
      name: "Portflio",
      desc: "A Responsive and animated React web app. ",
      github: "https://github.com/dextey/dextey.github.io.git",
      link: "",
    },
  ];

  return (
    <div className="container">
      <div className=" flex flex-col mt-10 justify-center mb-60">
        <div className="flex items-center ">
          <Link to={"/about"} className="text-white text-4xl">
            <FaAngleLeft />
          </Link>
          <span className="text-xl sm:text-2xl md:text-3xl  font px-3 font-extrabold text-yellow-200">
            Blueprints
          </span>
        </div>

        <div className="grid sm:grid-cols-1 pt-7">
          {projects.map((project) => {
            return <Project key={project.id} project={project} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Projects;

const Project = ({ project }) => {
  return (
    <div
      id={project.id}
      className="flex flex-col  m-2 rounded-md justify-evenly bg-white/5 backdrop-blur-2xl projectItem"
    >
      <div className="flex flex-col p-4 mx-2 mt-5 text-white">
        <h3 className="text-2xl font-bold font-mono flex items-center gap-2 ">
          {project.name}{" "}
          {project.web3 && (
            <span className="text-[1rem] text-black p-1 rounded-full bg-fuchsia-50">
              <FaEthereum />
            </span>
          )}
        </h3>
        <span className=" md:w-7/12 font-mono text-[16px] sm:py-2 sm:block   ">
          {project.desc}
        </span>
      </div>
      <div className="links flex gap-2  px-4 p-2  text-2xl text-white">
        <a
          target={project.link && "_blank"}
          href={project.link}
          className="hover:bg-yellow-200 hover:text-black p-3 rounded-full"
        >
          <FiZap />
        </a>
        <a
          target={project.github && "_blank"}
          href={project.github}
          className="hover:bg-yellow-200 hover:text-black p-3 rounded-full"
        >
          <FiGithub />
        </a>
      </div>
    </div>
  );
};
