"use client"

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPendingRequests } from "@/services/Web3Service";
import Request from "@/components/Admin";


export default function Home() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadPendingRequests(0);
  }, [])

  async function loadPendingRequests(){
    try{
      const result = await getPendingRequests();
      console.log(result);
      requests.push(...result);
      setRequests(result);
    }
    catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">Aprovação de Doações.</p>
        </div>
        <div className="p-4 mx-5">
          <div className="list-group">
            {
              requests && requests.length
              ? requests.map(rq => <Request key={rq.id} data={rq} />)
              : <>Conecte sua carteira MetaMask no botão "Entrar" para ajudar ou pedir ajuda.</>
            }
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}