import { useState, useEffect } from "react";
import { Api } from "/src/serveur/ApiConnector";
import { RhAccueilUI } from "/src/composants/RhAccueilUI";
import { RhCongeUI } from "/src/composants/RhCongeUI";
import { RhPaieUI } from "/src/composants/RhPaieUI";
import { RhRapportUI } from "/src/composants/RhRapportUI";
import { RhStaffUI } from "/src/composants/RhStaffUI";

export function EspaceRH({activeView}) {
    const [listEmploye, setListEmploye] = useState([]);
    useEffect(() => {
        Api.get("employes/stafftotal/").then((response) => {setListEmploye(response.data);}).catch((error) => {
            console.error("Error fetching data:", error);});
    }, []); 
    
    const views = { Accueil: <RhAccueilUI listEmploye={listEmploye}/>,
    Staff: <RhStaffUI listEmploye={listEmploye} setListEmploye={setListEmploye}/>, Salaire: <RhPaieUI listEmploye={listEmploye}/>,
    Congé: <RhCongeUI listEmploye={listEmploye} setListEmploye={setListEmploye}/>, Rapport: <RhRapportUI />};
    return views[activeView] || <div>Erreur</div>;
}