import "/src/main.css"
import "/src/assets/exiticon.svg"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BarreMenuRH({setActiveView}) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const buttons = ["Accueil", "Staff", "Salaire", "Congé", "Rapport"];
    const initial = localStorage.getItem("loginID");

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("loginID");
        navigate("/");
    }

    return (
        <div className="bg-white h-24 w-full flex justify-around items-center px-3 border-b-1 border-gray-200 shadow-[0_4px_8px_-3px_rgb(229_231_235)]">
            <div id="nom" className="cursor-default bg-blue-500 text-white h-11 w-11 rounded-full flex justify-center items-center">{initial.substring(0,2).toUpperCase()}</div>
            <nav className="w-130 h-full flex justify-around items-center">
                {buttons.map((label, index) => {
                    const bgPosition = prevIndex < activeIndex ? "left top" : "right top";
                    return(
                        <button key={index} onClick={() => {setActiveIndex(index); setPrevIndex(activeIndex); setActiveView(label);}}
                        style={{ backgroundPosition: bgPosition }}
                        className={`flex justify-center items-center h-10 w-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-500
                        bg-[length:0%_100%] bg-no-repeat focus:transition-[background-size,color] focus:duration-400 focus:ease-in-out ${
                        activeIndex === index ? "bg-[length:100%_100%] text-white" : "hover:text-blue-500"}`}>
                        {label}
                        </button>);
                    })
                }
            </nav>
            <button className="flex justify-around items-center h-8 w-8" onClick={() => logout()}>
                <svg fill="currentColor" className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors">
                    <path d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z"/>
                </svg>
            </button>
        </div>
    );
}