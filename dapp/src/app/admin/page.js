"use client"

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPendingRequests, getOpenRequests, getBlacklistedAddresses, addFromBlacklist } from "@/services/Web3Service";
import Pending from "@/components/Admin";
import Request from "@/components/Request";
import Blacklist from '@/components/Blacklist';


export default function Home() {

  const [pending, setPending] = useState([]);
  const [requests, setRequests] = useState([]);
  const [blacklistAddress, setBlacklistAddress] = useState([]);

  const [address, setAddress] = useState({
    address: "",
  })

  function onInputChange(evt){
    console.log("aquiii" + address.address)
    setAddress(prevState => ({... prevState, [evt.target.id]: evt.target.value}));
  }

  useEffect(() => {
    loadPendingRequests();
    loadRequests(0);
    loadBlacklistAddress();
  }, [])

  async function loadPendingRequests(){
    try{
      const result = await getPendingRequests();
      console.log(result);
      pending.push(...result);
      setPending(result);
    }
    catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  async function loadRequests(lastId){
    try{
      const result = await getOpenRequests(lastId);
      console.log(result);
      if(lastId === 0)
        setRequests(result);
      else{
        requests.push(...result);
        setRequests(requests);
      }
    }
    catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  async function loadBlacklistAddress(){
    try{
      const result = await getBlacklistedAddresses();
      console.log(result);
      blacklistAddress.push(...result);
      setBlacklistAddress(result);
    }
    catch(err){
      console.error(err);
      alert(err.message);
    }
  }

  function btnAddClick(){
    if(!confirm("Tem certeza que deseja adicionar esse address da blacklist?")) return;
    
    addFromBlacklist(address.address)
     .then(result => {
         alert("Address adicionado com sucesso. Em alguns minutos deixará de ser visto na lista.")
         window.location.reload();
     })
     .catch(err => {
         console.error(err);
         alert(err.message);
     })
 }

  return (
    <>
      <Header />
      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">Aprovação de Doações</p>
        </div>
        <div className="p-4 mx-5">
          <div className="list-group">
            {
              pending && pending.length
              ? pending.map(rq => <Pending key={rq.id} data={rq} />)
              : <>Conecte sua carteira MetaMask no botão "Entrar" para ajudar ou pedir ajuda.</>
            }
          </div>
        </div>
        <div className="row ps-5">
          <p className="lead m-4">Doações</p>
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
        
          <div className="row ps-5">
            <p className="lead m-4">Blacklist</p>
          </div>
          <div className="p-4 mx-5">
            <div className="form-floating mb-3">
                    <input type="text" id="address" className="form-control" maxLength={150} value={address.address} onChange={onInputChange} />
                    <label htmlFor="title">Add Address to blacklist</label>
                    <button type="button" className="btn btn-success btn-sm mt-2" onClick={btnAddClick}>Adicionar</button>
            </div>
            <div className="list-group">
              {
                blacklistAddress && blacklistAddress.length
                ? blacklistAddress.map(rq => <Blacklist key={rq.id} data={rq} />)
                : <>Conecte sua carteira MetaMask no botão "Entrar" para ajudar ou pedir ajuda.</>
              }
            </div>
        </div>
        <Footer />
      </div>
    </>
  );
}