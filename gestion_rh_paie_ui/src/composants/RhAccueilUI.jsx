import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

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