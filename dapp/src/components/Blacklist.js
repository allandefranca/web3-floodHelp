"use client"

import { removeFromBlacklist } from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar"
import { useState } from "react";

export default function Blacklist({ data }){

    function btnRemoveClick(){
       if(!confirm("Tem certeza que deseja retirar esse address da blacklist?")) return;
       
       removeFromBlacklist(data)
        .then(result => {
            alert("Address removido com sucesso. Em alguns minutos deixará de ser visto na lista.")
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
    }

    return (
        <>
            <div className="list-group-item list-group-item-action d-flex gap-3 py3">
                <img src={generateAvatarURL(data)} width="32" height="32" className="rounded-circle" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="mb-0"> Address: {data}</h6>
                            </div>
                            <div className="col-2">
                                <div className="text-end"> 
                                        <button type="button" className="btn btn-danger btn-sm" onClick={btnRemoveClick}>Remover</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}