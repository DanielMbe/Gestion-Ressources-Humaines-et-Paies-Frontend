import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { Api } from "/src/serveur/ApiConnector"

export function EspaceRH({activeView}) {
    const [listEmploye, setListEmploye] = useState([]);
    useEffect(() => {
        let loginID = localStorage.getItem("loginID");
        Api.get("stafftotal/", {params : {loginID}}).then((response) => {setListEmploye(response.data);}).catch((error) => {
            console.error("Error fetching data:", error);});
    }, []); 
    
    const views = { Accueil: <RhAccueilUI listEmploye={listEmploye}/>,
    Staff: <RhStaffUI listEmploye={listEmploye} setListEmploye={setListEmploye}/>, Salaire: <RhPaieUI listEmploye={listEmploye}/>,
    Congé: <RhCongeUI listEmploye={listEmploye} setListEmploye={setListEmploye}/>, Rapport: <RhRapportUI />};
    return views[activeView] || <div>Erreur</div>;
}

export function RhAccueilUI({listEmploye}) {
    let staffDisponible = 0;
    let staffIndisponible = 0;
    let paieEffectues = 0;
    let paieRestantes = 0;

    listEmploye.forEach(employe => {
        let disponibilite = "En congé";
        if (disponibilite.localeCompare(employe.disponibilite) == 0)
            staffIndisponible += 1;
        else
            staffDisponible += 1;

        let statut = "En attente";
        if (statut.localeCompare(employe.statut) == 0)
            paieRestantes += 1;
        else
            paieEffectues += 1;
    });

    if (staffDisponible > 0 || staffIndisponible > 0) {
        staffDisponible = staffDisponible * 100 / (staffDisponible + staffIndisponible);
        staffIndisponible = 100 - staffDisponible;
    }

    if (paieRestantes > 0 || paieEffectues > 0) {
        paieRestantes = paieRestantes * 100 / (paieRestantes + paieEffectues);
        paieEffectues = 100 - paieRestantes;
    }

    const StaffData = [
        { name: "Staff disponible", value: staffDisponible },
        { name: "Staff en congé", value: staffIndisponible },
    ];

    const PaieData = [
        { name: "Paies Effectuées", value: paieEffectues },
        { name: "Paies Restantes", value: paieRestantes },
    ];

    const COLORS = ["#14b8a6", "#818cf8"];

    return(
        <div className="h-full w-full flex justify-around items-center bg-white px-5 my-5">
            <div className="h-1/2 min-h-100 w-250 flex justify-around items-center border-blue-300 border-2 rounded-2xl p-5">
                <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                        <Pie data={StaffData} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius="80%" fill="#8884d8" dataKey="value">
                            {StaffData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer  height="100%" width="100%">
                    <PieChart width={400} height={300}>
                        <Pie data={PaieData} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius="80%" fill="#8884d8" dataKey="value">
                            {PaieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function ajouterEmployer({listEmploye, setListEmploye}) {
    let lname=document.getElementById("ajoutNom").value;
    let fname=document.getElementById("ajoutPrenom").value;
    let mail=document.getElementById("ajoutEmail").value;
    let job=document.getElementById("ajoutPoste").value;
    let dept=document.getElementById("ajoutDept").value;
    let earn=document.getElementById("ajoutSalaire").value;
    let admin = localStorage.getItem("loginID");

    Api.post("ajout/", {lname, fname, mail, job, dept, earn, admin})
    .then(response => {setListEmploye([...listEmploye, response.data]);}).catch(error => console.error(error));
}

export function RhStaffUI({listEmploye, setListEmploye}) {
    const [estOuvert, setEstOuvert] = useState(false);
    const ouvrirDialogue = () => setEstOuvert(true);
    const fermerDialogue = () => setEstOuvert(false);

    const [estModifier, setEstModifier] = useState(false);
    const [staffSelectioner, setStaffSelectioner] = useState(null);
    const ouvrirModifier = (employe) => {setEstModifier(true); setStaffSelectioner(employe);}
    const fermerModifier = () => setEstModifier(false);
    const validerModifier = async (cleId) => {
        if (estModifier) {
            for(const employe of listEmploye) {
                if (cleId == employe.id) {
                    let mail = employe.email;
                    let job = employe.poste;
                    let dept = employe.departement;
                    let earn = employe.salaire;
                    Api.post("modifier/", {cleId, mail, job, dept, earn}).then(fermerModifier()).catch(error => console.error(error));
                    break;
                }
            }
        }
    };

    return (
        <div className="h-full w-full flex flex-col justify-around bg-white px-5 my-5">
            <div className="h-24 w-full flex justify-end items-center px-3">
                <button className="h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out"
                onClick={() => ouvrirDialogue()}>Ajouter</button>
            </div>
            {estOuvert && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30">
                    <form action="#" className="h-125 w-200 flex flex-col justify-around items-center bg-white rounded-2xl">
                        <div className="h-30 flex justify-around items-center text-3xl text-blue-500 font-bold w-full my-2 px-1">NOUVEL EMPLOYE</div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input id="ajoutNom" required type="text" placeholder="Nom" className="w-1/2 h-14 max-w-100 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                            <input id="ajoutPrenom" required type="text" placeholder="Prénom" className="w-full h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                        </div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input id="ajoutEmail" required type="email" placeholder="Email" className="w-full h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                            <select id="ajoutDept" className="h-10 w-110 border-b-2 border-blue-200 outline-none mx-2">
                                <option>Direction RH</option>
                                <option>Direction Marketing</option>
                                <option>Direction Comptable</option>
                                <option>Direction Informatique</option>
                            </select>
                        </div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input id="ajoutPoste" required type="text" placeholder="Poste" className="w-1/2 h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                            <input id="ajoutSalaire" required type="number" min={75000} max={5000000} placeholder="Salaire" className="w-1/2 h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                        </div>
                        <div className="h-30 flex justify-end items-center w-full my-2 px-1">
                            <button className="h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out mx-2"
                            onClick={() => fermerDialogue()}>Annuler</button>
                            <button type="submit" className="h-11 w-30 text-white bg-blue-500 rounded-xl hover:bg-blue-700 transition-background duration-400 ease-in-out mx-2"
                            onClick={() => {ajouterEmployer({listEmploye, setListEmploye}); fermerDialogue();}}>Ajouter</button>
                        </div>
                     </form>
                </div>
            )}
            <div className="h-full w-full flex flex-col px-2">
                {listEmploye.map((staff) => {
                    return (
                        <div className="flex justify-center items-center w-full">
                            <div className="flex justify-around items-center h-14 w-full max-w-250 bg-gray-100 rounded-xl my-2 px-2">
                                <div className="w-1/5">{staff.nom}</div>
                                <div className="w-1/4">{staff.prenom}</div>
                                <div className="w-1/5">{staff.poste}</div>
                                <div className="w-1/4">{staff.departement}</div>
                            </div>
                            <button className="flex justify-around items-center h-10 w-10 mx-2"
                            onClick={() => ouvrirModifier(staff)}>
                                <svg fill="currentColor" className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors">
                                    <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 
                                    8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 
                                    .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/>
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
            {estModifier && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30">
                    <div className="h-125 w-200 flex flex-col justify-around items-center bg-white rounded-2xl">
                        <div className="h-30 flex justify-around items-center text-3xl text-blue-500 font-bold w-full my-2 px-1">INFO EMPLOYE</div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input type="text" value={staffSelectioner.nom} className="w-1/2 h-14 max-w-100 outline-none mx-2 px-2" readOnly/>
                            <input type="text" value={staffSelectioner.prenom} className="w-full h-14 max-w-150 outline-none mx-2 px-2" readOnly/>
                        </div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input type="text" placeholder="Email" defaultValue={staffSelectioner.email} onChange={(e) => {staffSelectioner.email = e.target.value}} className="w-full h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                            <select className="h-10 w-110 border-b-2 border-blue-200 outline-none mx-2" defaultValue={staffSelectioner.departement} onChange={(e) => {staffSelectioner.departement = e.target.value}}>
                                <option>Direction RH</option>
                                <option>Direction Marketing</option>
                                <option>Direction Comptable</option>
                                <option>Direction Informatique</option>
                            </select>
                        </div>
                        <div className="flex justify-around items-center w-full my-2 px-2">
                            <input type="text" placeholder="Poste" defaultValue={staffSelectioner.poste} onChange={(e) => {staffSelectioner.poste = e.target.value}} className="w-1/2 h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                            <input type="number" min={75000} max={5000000} defaultValue={staffSelectioner.salaire} onChange={(e) => {staffSelectioner.salaire = e.target.value}} placeholder="Salaire" className="w-1/2 h-14 max-w-150 bg-gray-100 outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                        </div>
                        <div className="h-30 flex justify-end items-center w-full my-2 px-1">
                            <button className="h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out mx-2"
                            onClick={() => fermerModifier()}>Annuler</button>
                            <button className="h-11 w-30 text-white bg-blue-500 rounded-xl hover:bg-blue-700 transition-background duration-400 ease-in-out mx-2"
                            onClick={() => validerModifier(staffSelectioner.id)}>Modifier</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function RhPaieUI({listEmploye}) {
    let effectuerPaie = async (event, id) => {
        for (const employe of listEmploye) {
            if (id == employe.id) {
                if (employe.statut.localeCompare("En attente") == 0) {
                    await Api.post("validerpaie/", { id }).then(() => {
                        employe.statut = "Effectué";
                        event.target.textContent = "Fiche Paie";
                        event.target.className = "";
                        event.target.className = "h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out mx-2";
                    }).catch(error => console.error(error));
                } else {
                    await Api.get("salaire/", { params: { id }, responseType: "blob"}).then(response => {
                        const blob = new Blob([response.data], { type: "application/pdf" });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "bulletin_de_paie.pdf";
                        document.body.appendChild(link);
                        link.click();
                        link.remove();

                        window.URL.revokeObjectURL(url);
                    }).catch(error => console.error(error));
                }
                break;
            }
        }
    }

    return (
        <div className="h-full w-full flex flex-col justify-around bg-white px-5 my-5">
            <div className="h-24 w-full flex justify-end items-center px-3">
            </div>
            <div className="h-full w-full flex flex-col px-2">
                {listEmploye.map((paie) => {
                    return (
                        <div className="flex justify-center items-center w-full">
                            <div className="flex justify-around items-center h-14 w-full max-w-250 bg-gray-100 rounded-xl my-2 px-2">
                                <div className="w-1/5">{paie.nom}</div>
                                <div className="w-1/4">{paie.prenom}</div>
                                <div className="w-1/5">{paie.poste}</div>
                                <div className="w-1/5">{paie.salaire}</div>
                            </div>
                            <button type="button" className={`${paie.statut === "En attente" ? "flex justify-around bg-blue-500 text-white items-center hover:bg-blue-700 h-11 w-30 rounded-xl mx-2 transition-background duration-400 ease-in-out" : "h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out mx-2"}`}
                            onClick= {() => effectuerPaie(event, paie.id)}>
                            {paie.statut === "En attente"? "Payer" : "Fiche Paie"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

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

export function RhRapportUI() {
    let telechargerRapportPDF = async () => {
        let loginID = localStorage.getItem("loginID");
        await Api.get("rapportpdf/", { params: { loginID }, responseType: "blob"}).then(response => {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "rapport_rh_pdf.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        }).catch(error => console.error(error));
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white px-5 my-5">
            <div className="text-2xl my-10">RAPPORT RESSOURCES HUMAINES ET PAIES EN PDF</div>
            <div className="flex justify-center items-center h-22 w-full max-w-250 bg-white px-2">
                <button className="flex justify-around bg-cyan-500 text-3xl text-white items-center hover:bg-cyan-700 h-20 w-80 rounded-xl mx-2 transition-background duration-400 ease-in-out"
                onClick={() => telechargerRapportPDF()}>
                    Telecharger
                </button>
            </div>
        </div>
    );
}