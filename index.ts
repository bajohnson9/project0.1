import Express from "express";
import { bankingDaoAzure } from "./daos/banking-dao";
import { Account, Client } from "./entities";
import errorHandler from "./error-handles";
import { BankingService, BankingServiceImpl } from "./services/banking-service";

const app = Express()
app.use(Express.json())


const bankingService: BankingService = new BankingServiceImpl(bankingDaoAzure)

//get all clients
app.get('/clients', async (req, res) => {

    try {
        const clients: Client[] = await bankingService.getAllClients();
        res.send(clients)
    } catch (error) {
        errorHandler(error,req,res)
    }
    
})

//get single client
app.get('/clients/:id', async (req, res)=>{

    try {
        const client: Client = await bankingService.getClientById(req.params.id)
        res.send(client)    
    } catch (error) {
        errorHandler(error,req,res)
    }

})

//add client
app.post('/clients', async (req, res)=>{

    try {
        let client: Client = req.body
        client = await bankingService.addClient(client)
        res.sendStatus(201)
        res.send(client)      
    } catch (error) {
        errorHandler(error,req,res)
    }


})

//update account
app.post('/clients/:id', async (req,res)=>{

    try {
        const client: Client = req.body
        await bankingService.modifyClient(client)
        res.sendStatus(201)   
    } catch (error) {
        errorHandler(error,req,res)
    }
})

//delete acct
app.delete('/clients/:id', async (req,res) =>{
    try{
        const id = req.params.id;
        await bankingService.deleteClient(id);
    } catch (error) {
        errorHandler(error,req,res)
    }
})

app.listen(3000, () => console.log('App started'))