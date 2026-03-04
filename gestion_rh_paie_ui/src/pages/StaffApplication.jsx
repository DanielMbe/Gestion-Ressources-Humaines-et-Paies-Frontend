import "react"
import { useState } from "react"
import { BarreMenuStaff } from "/src/composants/BarreMenuStaff"
import { EspaceStaff } from "/src/composants/EspaceStaff"

export function StaffApplication() {
    const [activeView, setActiveView] = useState("Salaire");
    let access = localStorage.getItem("access");
    let refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
        window.location.href = "/";
        return(<></>);
    }
    
    return(
        <div className="flex flex-col h-full w-full">
            <BarreMenuStaff  setActiveView={setActiveView}/>
            <EspaceStaff activeView={activeView}/>
        </div>
    );
}