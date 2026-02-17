import { Api } from "/src/serveur/ApiConnector"

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