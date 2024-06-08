"use client"

import { useState, useEffect } from "react"
import { doLogin, doLogout, contractCreatorAddress} from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar"

export default function Header() {

    const [wallet, setWallet] = useState("");

    useEffect(() => {
        setWallet(localStorage.getItem("wallet") || "")
        console.log("testudo" + contractCreatorAddress);
    }, [])

    function btnLoginClick(){
        doLogin()
            .then(wallet => setWallet(wallet))
            .catch(err => {
                console.error(err);
                alert(err.message);
            })
    }

    function btnLogoutClick() {
        doLogout()
            .then(
        setWallet(""),
        localStorage.removeItem("wallet"),
        alert("Para concluir o Logout você precisa desconectar pelo Metamask"),
        window.location.reload())
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
    }

    function formatWalletAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
    }

    return (
        <header className="p-3 text-bg-dark">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center">
                    <a href="/" className="justify-content-start" style={{ textDecoration: "none" }}>
                        <h1 className="fw-bold text-light">FloodHelp</h1>
                    </a>
                    <div className="text-end col-9">
                        {   
                            wallet
                                ?  <>
                                    <button type="button" className="btn btn-outline-light me-2" onClick={btnLoginClick}>
                                    <img src={generateAvatarURL(wallet)} width="24" className="rounded-circle me-2" />
                                        {formatWalletAddress(wallet)}
                                    </button>
                                    <a href="/create" className="btn btn-warning me-2">Pedir Ajuda</a>
                                    {contractCreatorAddress && wallet.toLowerCase() === contractCreatorAddress.toLowerCase() && (
                                        <a href="/admin" className="btn btn-danger me-2">Admin Page</a>
                                    )}
                                    <button type="button" className="btn btn-outline-light me-2" onClick={btnLogoutClick}>Logout</button>
                                </>
                                :  <button type="button" className="btn btn-outline-light me-2" onClick={btnLoginClick}>
                                    <img src="/metamask.svg" width="24" className="me-3" />
                                    Entrar
                                </button>
                        }                  
                    </div>
                </div>
            </div>
        </header>
    )
}