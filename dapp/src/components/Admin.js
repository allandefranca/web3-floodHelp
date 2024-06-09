import { changeRequestStatus } from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar"
import Web3 from "web3"

export default function Pending({ data }){

    function btnAproveClick(){
        if(!confirm("Tem certeza que deseja Aprovar este pedido?")) return;
       
        changeRequestStatus(data.id,1)
        .then(result => {
            alert("Pedido aprovado com sucesso. Em alguns minutos deixará de ser visto no site.")
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
    }

    function btnCloseClick(){
        if(!confirm("Tem certeza que deseja fechar este pedido?")) return;
        
        changeRequestStatus(data.id,2)
         .then(result => {
             alert("Pedido fechado com sucesso. Em alguns minutos deixará de ser visto no site.")
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
                <img src={generateAvatarURL(data.author)} width="32" height="32" className="rounded-circle" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="mb-0">{data.title} &rsaquo;&rsaquo; Contato: {data.contact}</h6>
                            </div>
                            <div className="col-2">
                                <div className="text-end">
                                    <button type="button" className="btn btn-success btn-sm" onClick={btnAproveClick}>Aprovar</button>
                                    <button type="button" className="btn btn-danger btn-sm ms-2" onClick={btnCloseClick}>Reprovar</button>
                                </div>
                            </div>
                        </div>
                        <p className="opacity-75 pe-5 mb-0 me-5">{data.description}</p>
                        <div className="row">
                            <div className="col">
                                    <span className="me-1 opacity-75">Meta:</span>
                                    <span className="opacity-50">
                                    {
                                        data.balance
                                            ? `BNB ${Web3.utils.fromWei(data.balance, "ether")} obitidos de ${Web3.utils.fromWei(data.goal,"ether")}`
                                            : `BNB ${Web3.utils.fromWei(data.goal, "ether")}`
                                    }
                                    </span>
                            </div>       
                        </div>
                        <div className="row">
                            <div className="col">
                                    <span className="me-1 opacity-75">Author:</span>
                                    <span className="opacity-50">{data.author}</span>
                            </div>       
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}