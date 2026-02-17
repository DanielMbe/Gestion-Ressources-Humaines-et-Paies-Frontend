import { useState } from "react"
import { Api } from "/src/serveur/ApiConnector"

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
                                <div className="w-1/5">{staff.departement}</div>
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
