import { Api } from "/src/serveur/ApiConnector"

export function StaffPaieUI({listPaie}) {
    /*let fichedePaie = async (email) => {
        await Api.get("paies/salaire/", { params: { email }, responseType: "blob"}).then(response => {
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
    }*/

    return (
        <div className="h-full w-full flex flex-col justify-around bg-white px-5 my-5">
            <div className="h-24 w-full flex justify-end items-center px-3">
            </div>
            <div className="h-full w-full flex flex-col px-2">
                {listPaie.map((paie) => {
                    return (
                        <div className="flex justify-center items-center w-full" key={localStorage.getItem("loginID")}>
                            <div className="flex justify-around items-center h-14 w-full max-w-250 bg-gray-100 rounded-xl my-2 px-2">
                                <div className="w-1/5">{"Base : "+paie.salaire_base}</div>
                                <div className="w-1/5">{"Net : "+paie.salaire_net}</div>
                                <div className="w-1/5">{"CNPS : "+paie.cnps}</div>
                                <div className="w-1/5">{"ITS : "+paie.its}</div>
                                <div className="w-1/5">{"Date : "+paie.date_paiement}</div>
                            </div>{/*
                            <button type="button" className="h-11 w-30 bg-white border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-background duration-400 ease-in-out mx-2"
                            onClick= {() => fichedePaie(localStorage.getItem("loginID"))}>
                            {"Fiche Paie"}
                            </button>*/}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}