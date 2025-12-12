import "react"
import { useState } from "react"
import { BarreMenuRH } from "/src/composants/BarreMenuRH"
import { EspaceRH } from "/src/composants/EspaceRH"

export function Application() {
    const [activeView, setActiveView] = useState("Accueil");
    let access = localStorage.getItem("access");
    let refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
        window.location.href = "/";
        return(<></>);
    }
    
    return(
        <div className="flex flex-col h-full w-full">
            <BarreMenuRH  setActiveView={setActiveView}/>
            <EspaceRH activeView={activeView}/>
        </div>
    );
}