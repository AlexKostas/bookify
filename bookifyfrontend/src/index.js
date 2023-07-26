import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios"
import { AuthContextProvider } from "./context/AuthContext";
import { SearchContextProvider } from "./context/SearchContext";

axios.defaults.baseURL = 'https://localhost:8443'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <SearchContextProvider>
                <App />
            </SearchContextProvider>
        </AuthContextProvider>
    </React.StrictMode>
);