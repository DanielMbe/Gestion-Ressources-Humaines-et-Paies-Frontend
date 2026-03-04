import { useState, useEffect } from "react";
import { Api } from "/src/serveur/ApiConnector";
import { StaffCongeUI } from "/src/composants/StaffCongeUI";
import { StaffPaieUI } from "/src/composants/StaffPaieUI";

export function EspaceStaff({activeView}) {
    const [listPaie, setListPaie] = useState([]);
    const [listConge, setListConge] = useState([]);

    useEffect(() => {
        Api.get("paies/listpaies/").then((response) => {setListPaie(response.data);}).catch((error) => {
            console.error("Error fetching data:", error);});
    }, []); 

    useEffect(() => {
        Api.get("conges/listconges/").then((response) => {setListConge(response.data);}).catch((error) => {
            console.error("Error fetching data:", error);});
    }, []); 

    const views = { 
        Salaire: <StaffPaieUI listPaie={listPaie} setListPaie={setListPaie}/>, 
        Congé: <StaffCongeUI listConge={listConge} setListConge={setListConge}/>
    };
    return views[activeView] || <div>Erreur</div>;
}