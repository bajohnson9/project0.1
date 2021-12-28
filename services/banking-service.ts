import { BankingDAO } from "../daos/banking-dao";
import { Client, Account } from "../entities";

export interface BankingService{
    
    getClientById(clientId: string): Promise<Client>
    getAllClients(): Promise<Client[]>;
    addClient(client: Client): Promise<Client>
    modifyClient(client: Client):Promise<Client>
    deleteClient(clientId: string):Promise<Boolean>

}


export class BankingServiceImpl implements BankingService{
    constructor(private bankingDAO: BankingDAO){}

    async addClient(client: Client): Promise<Client> {
        client.accounts = client.accounts ?? []
        client = await this.bankingDAO.createClient(client)
        return client;
    }

    async getAllClients(): Promise<Client[]> {
        return this.bankingDAO.getAllClients() 
    }

    async getClientById(clientId: string): Promise<Client> {
        return this.bankingDAO.getClientById(clientId)
    }
    
    async modifyClient(client: Client): Promise<Client> {
        client.accounts = client.accounts ?? []
        client = await this.bankingDAO.modifyClient(client)
        return client;
    }

    async deleteClient(clientId: string): Promise<Boolean> {
        return this.bankingDAO.deleteClientById(clientId);
    }
}