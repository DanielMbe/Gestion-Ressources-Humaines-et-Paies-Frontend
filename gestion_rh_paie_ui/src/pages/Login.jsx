import "/src/main.css"
import { useNavigate } from "react-router-dom";
import { Api } from "/src/serveur/ApiConnector"

export function Login() {
    const navigate = useNavigate();
    const login = async (username, password) => {
        if (username.length < 1 || password.length < 1)
            return;

        const res = await Api.post('signin/', { username, password });
        if (res.data.access && res.data.refresh) {
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("loginID", username);
            navigate("/gestion-rh");
        }
    }
    
    //login("colonelmbe", "Ololan25");
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <form action="#" className="h-100 w-200 flex flex-col justify-around items-center bg-gray-50 rounded-4xl">
                <div className="h-30 flex justify-around items-center text-3xl text-blue-500 font-bold w-full my-2 px-1">Connection</div>
                <div className="flex justify-around items-center w-full my-2 px-2">
                    <input id="setId" required type="email" placeholder="Identifiant" className="w-full h-14 max-w-150 bg-white outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                </div>
                <div className="flex justify-around items-center w-full my-2 px-2">
                    <input id="setPwd" required type="password" placeholder="Mot de passe" className="w-full h-14 max-w-150 bg-white outline-none border-2 border-gray-100 focus:border-blue-200 rounded-xl mx-2 px-2"/>
                </div>
                <div className="h-30 flex justify-end items-center w-full max-w-150 my-2">
                    <button type="submit" className="h-14 w-40 text-white text-lg font-bold bg-blue-500 rounded-xl hover:bg-blue-700 transition-background duration-400 ease-in-out mx-2"
                    onClick={() => login(document.getElementById("setId").value, document.getElementById("setPwd").value)}>Se connecter</button>
                </div>
            </form>
        </div>
    );
}