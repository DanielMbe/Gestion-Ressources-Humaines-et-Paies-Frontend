import { Api } from "/src/serveur/ApiConnector"

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