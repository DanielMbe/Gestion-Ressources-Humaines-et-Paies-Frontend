import { Api } from "/src/serveur/ApiConnector"

export function RhCongeUI({listEmploye}) {
    let approuverConge = async (event, id) => {
        for (const employe of listEmploye) {
            if ((id == employe.id) && (employe.disponibilite.localeCompare("En demande") == 0)) {
                await Api.post("approuverconge/", { id }).then(() => {
                    event.target.className = "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out";
                    let buttonId = event.target.id;
                    let nextbutton = document.getElementById(buttonId.replace("1", "2"));
                    nextbutton.className =  "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out";
                    employe.disponibilite = "En congé";
                    document.getElementById(employe.email).textContent = "En congé";
                }).catch(error => console.error(error));
                break;
            }
        }
    }

    let desapprouverConge = async (event, id) => {
        for (const employe of listEmploye) {
            if ((id == employe.id) && (employe.disponibilite.localeCompare("En demande") == 0)) {
                await Api.post("rejeterconge/", { id }).then(() => {
                    event.target.className = "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out";
                    let buttonId = event.target.id;
                    let nextbutton = document.getElementById(buttonId.replace("2", "1"));
                    nextbutton.className =  "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out";
                    employe.disponibilite = "En service";
                    document.getElementById(employe.email).textContent = "En service";
                }).catch(error => console.error(error));
                break;
            }
        }
    }

    return (
        <div className="h-full w-full flex flex-col justify-around bg-white px-5 my-5">
            <div className="h-24 w-full flex justify-center items-center px-3">
            </div>
            <div className="h-full w-full flex flex-col px-2">
                {listEmploye.map((staff) => {
                    return (
                        <div className="flex justify-center items-center w-full">
                            <div className="flex justify-around items-center h-14 w-full max-w-250 bg-gray-100 rounded-xl my-2 px-2">
                                <div className="w-1/5">{staff.nom}</div>
                                <div className="w-1/4">{staff.prenom}</div>
                                <div className="w-1/5">{staff.poste}</div>
                                <div className="w-1/5" id={staff.email}>{staff.disponibilite}</div>
                            </div>
                            <button id={staff.nom+staff.prenom.split(" ").at(0)+"1"} className={`${staff.disponibilite === "En demande" ? "flex justify-around bg-blue-500 text-white items-center hover:bg-blue-700 h-11 w-11 rounded-xl mx-2 transition-background duration-400 ease-in-out" : "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out"}`}
                            onClick={() => approuverConge(event, staff.id)}>
                               <svg fill="currentColor" className="w-6 h-6 text-white pointer-events-none">
                                    <path d="M5 22h-5v-12h5v12zm17.615-8.412c-.857-.115-.578-.734.031-.922.521-.16 1.354-.5 1.354-1.51 
                                    0-.672-.5-1.562-2.271-1.49-1.228.05-3.666-.198-4.979-.885.906-3.656.688-8.781-1.688-8.781-1.594 0-1.896 1.807-2.375 
                                    3.469-1.221 4.242-3.312 6.017-5.687 6.885v10.878c4.382.701 6.345 2.768 10.505 2.768 3.198 0 4.852-1.735 4.852-2.666 
                                    0-.335-.272-.573-.96-.626-.811-.062-.734-.812.031-.953 1.268-.234 1.826-.914 1.826-1.543 
                                    0-.529-.396-1.022-1.098-1.181-.837-.189-.664-.757.031-.812 1.133-.09 1.688-.764 1.688-1.41 0-.565-.424-1.109-1.26-1.221z"/>
                               </svg> 
                            </button>
                            <button id={staff.nom+staff.prenom.split(" ").at(0)+"2"} className={`${staff.disponibilite === "En demande" ? "flex justify-around bg-red-500 text-white items-center hover:bg-red-700 h-11 w-11 rounded-xl mx-2 transition-background duration-400 ease-in-out" : "flex justify-around items-center h-11 w-11 bg-gray-200 rounded-xl mx-2 transition-background duration-400 ease-in-out"}`}
                            onClick={() => desapprouverConge(event, staff.id)}>
                                <svg fill="currentColor" className="w-6 h-6 text-white pointer-events-none">
                                    <path d="M5 14h-5v-12h5v12zm18.875-4.809c0-.646-.555-1.32-1.688-1.41-.695-.055-.868-.623-.031-.812.701-.159 1.098-.652 1.098-1.181 
                                    0-.629-.559-1.309-1.826-1.543-.766-.141-.842-.891-.031-.953.688-.053.96-.291.96-.626-.001-.931-1.654-2.666-4.852-2.666-4.16 0-6.123 
                                    2.067-10.505 2.768v10.878c2.375.869 4.466 2.644 5.688 6.886.478 1.661.781 3.468 2.374 3.468 2.375 0 2.594-5.125 1.688-8.781 1.312-.688 
                                    3.751-.936 4.979-.885 1.771.072 2.271-.818 2.271-1.49 0-1.011-.833-1.35-1.354-1.51-.609-.188-.889-.807-.031-.922.836-.112 1.26-.656 1.26-1.221z"/>
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}