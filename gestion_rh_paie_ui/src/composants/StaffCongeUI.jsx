import { Api } from "/src/serveur/ApiConnector"

export function StaffCongeUI({listConge}) {
    let demanderConge = async (event, email) => {
        await Api.put("conges/demanderconge/", { email }).then(() => {
            event.target.disabled = true;
            document.getElementById(email).textContent = "Demandé";
        }).catch(error => console.error(error));
    }

    return (
        <div className="h-full w-full flex flex-col justify-around bg-white px-5 my-5">
            <div className="h-24 w-full flex justify-center items-center px-3">
            </div>
            <div className="h-full w-full flex flex-col px-2">
                {listConge.map((conge) => {
                    return (
                        <div className="flex justify-center items-center w-full" key={localStorage.getItem("loginID")}>
                            <div className="flex justify-around items-center h-14 w-full max-w-250 bg-gray-100 rounded-xl my-2 px-2">
                                <div className="w-1/5">{"Date : "+conge.date_demande}</div>
                                <div className="w-1/4">{"Debut : "+conge.date_debut}</div>
                                <div className="w-1/5">{"Fin : "+conge.date_fin}</div>
                                <div className="w-1/5" id={localStorage.getItem("loginID")}>{"Statut : "+conge.statut}</div>
                            </div>
                            <button type="button" disabled={conge.statut !== "Rejeter"} className="flex justify-around disabled:bg-gray-100 disabled:text-gray-400 bg-blue-500 text-white items-center hover:bg-blue-700 h-11 w-30 rounded-xl mx-2 transition-background duration-400 ease-in-out"
                            onClick= {() => demanderConge(event, localStorage.getItem("loginID"))}>
                            {conge.statut === "Approuver"? "En Congé" : conge.statut === "Demander"? "En Attente": "Demander"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}