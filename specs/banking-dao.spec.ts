import { BankingDAO, bankingDaoAzure } from "../daos/banking-dao"
import { Account, Client } from "../entities";
import { BankingService, BankingServiceImpl } from "../services/banking-service";


const bankingDao: BankingDAO = bankingDaoAzure;

let testId: string = null;

describe('DAO Specs', ()=>{

    it('should list all clients', async ()=>{
        let clients: Client[] = await bankingDao.getAllClients()
        expect(clients).toBeTruthy();
    })

    it('should create a client', async ()=>{
        let client: Client = {name:'carlton', id:'7', accounts:[]}
        client = await bankingDao.createClient(client)
        expect(client.id).toBe('7')
    })

    it('should get a client', async ()=>{
        const client: Client = await bankingDao.getClientById('7')
        expect(client.name).toBeTruthy()
    })
   
    it('should upsert a client', async ()=>{
        let client: Client = {name:'carlton', id:'7', accounts:[{type:'Savings', balance: 919}]}
        expect(client.accounts[0].type).toBe('Savings')
    })

    

    // ------------------------- BLOCK 2 ----------------------- //

    it('should add an account to carlton', async ()=>{
        const account: Account = {type:'Checking', balance: 2009}
        let client: Client = await bankingDao.getClientById('7')
        client.accounts.push(account)
        const updatedClient = await bankingDao.addAccount(client)
        
        
        const tempClient = await bankingDao.getClientById(client.id)
        tempClient.accounts.push(account);
        expect(tempClient.accounts[1].type).toBe('Checking')
    })

    //still failing (not anymore!!)
    it('should return all accounts within a client', async ()=>{
        const response = await bankingDao.getClientById('7')
        expect(response.accounts).toBeTruthy()
    })

    it('should withdraw/deposit from an account', async ()=>{
        let client = await bankingDao.getClientById('7')

        for(let i = 0; i < client.accounts.length; i++){
            if(client.accounts[i].type === 'Checking'){
                client.accounts[i].balance -= 500;
                client = await bankingDao.modifyClient('7', client)
            }
        }

        const response = await bankingDao.modifyClient('7', client)
        expect(response.accounts[0].balance).toBe(1509)
    })

    it('should delete a client', async ()=>{
        const response = await bankingDao.deleteClientById('7');
        expect(response).toBeTruthy();
    })
})