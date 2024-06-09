import Web3 from "web3";
import ABI from "./ABI.json";

export const contractCreatorAddress = "";
const CONTRACT_ADDRESS = "";


export default contractCreatorAddress;

export async function doLogin(){
    if(!window.ethereum) throw new Error("Sem Metamask instalada!");

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if(!accounts || !accounts.length) throw new Error("Carteira não permitida");

    localStorage.setItem("wallet", accounts[0].toLowerCase());
    return accounts[0];
}

export async function doLogout(){
    if (window.ethereum && window.ethereum.selectedAddress) {
        window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
                eth_accounts: {}
            }]
        })
    }
    // Clear the Web3 instance
    if (window.web3) {
        window.web3 = undefined;
    }
}

function getContract(){
    if(!window.ethereum) throw new Error("Sem Metamask instalada!");

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);
    
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getOpenRequests(lastId = 0){
    const contract = getContract();
    const requests = await contract.methods.getOpenRequests(lastId + 1, 10).call();
    return requests.filter(rq => rq.title !== "");
    
}   

export async function getPendingRequests(){
    const contract = getContract();
    const requests = await contract.methods.getPendingRequests().call();
    return requests.filter(rq => rq.title !== "");
    
}   

export async function getBlacklistedAddresses(){
    const contract = getContract();
    const requests = await contract.methods.getBlacklistedAddresses().call();
    return requests.filter(rq => rq.title !== "");
    
}   

export async function changeRequestStatus(id,statusId){
    const contract = getContract();
    return contract.methods.changeRequestStatus(id,statusId).send();
}

export async function openRequest({ title, description, contact, goal }){
    const contract = getContract();
    return contract.methods.openRequest(title, description, contact,Web3.utils.toWei(goal, "ether")).send();
}

export async function closeRequest(id){
    const contract = getContract();
    return contract.methods.closeRequest(id).send();
}

export async function donate(id, donateInBnb){
    const contract = getContract();
    return contract.methods.donate(id).send({
        value: Web3.utils.toWei(donateInBnb, "ether")
    });
}

export async function removeFromBlacklist(address){
    const contract = getContract();
    return contract.methods.removeFromBlacklist(address).send();
}

export async function addFromBlacklist(address){
    const contract = getContract();
    return contract.methods.addToBlacklist(address).send();
}
