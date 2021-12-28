import { Client } from "../entities";
import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { ResourceNotFoundError } from "../error-handles";

export interface BankingDAO{

    //Create
    createClient(client: Client): Promise<Client>

    //Read
    getClientById(id: string): Promise<Client>
    getAllClients(): Promise<Client[]>

    //Update
    modifyClient(client: Client): Promise<Client>

    //Delete
    deleteClientById(id: string ): Promise<boolean>

}


class BankingDaoAzure implements BankingDAO{
    //private cclient = new CosmosClient(process.env.DB ?? 'AccountEndpoint=https://rpas-cosmosdb-account-bj.documents.azure.com:443/;AccountKey=n1tabnIm5g3iBMx1CAN2zqRN4bHVlRI8jFXaIszIOVgrB8Wqo35AtLB3Gj1ruIEhS9BYQcmLSclRKyOmpVMuJg==')
    private cclient = new CosmosClient(process.env.DB ?? 'AccountEndpoint=https://rpas-cosmosdb-account-bj.documents.azure.com:443/;AccountKey=n1tabnIm5g3iBMx1CAN2zqRN4bHVlRI8jFXaIszIOVgrB8Wqo35AtLB3Gj1ruIEhS9BYQcmLSclRKyOmpVMuJg==')
    private database = this.cclient.database('project0-db')
    private container = this.database.container('clients')

    async createClient(client: Client): Promise<Client> {
        client.id = client.id ?? v4();
        const response = await this.container.items.create<Client>(client)
        const {id, name, accounts} = response.resource;
        return {id, name, accounts}
    }

    async getClientById(cid: string): Promise<Client> {
        const response = await this.container.item(cid, cid).read<Client>();
        if(!response.resource){
            throw new ResourceNotFoundError(`Client with id ${cid} was not found`)
        }
        return {id:response.resource.id, name: response.resource.name, accounts:response.resource.accounts}
    }

    async getAllClients(): Promise<Client[]> {
        const response = await this.container.items.readAll<Client>().fetchAll()
        return response.resources.map(i => ({accounts: i.accounts, id:i.id, name:i.name}))
    }
    
    async modifyClient(client: Client): Promise<Client> {
       const response = await this.container.items.upsert<Client>(client)
       if(!response.resource){
            throw new ResourceNotFoundError(`Client with id ${client.id} was not found`)
       }
       const {id, name, accounts} = response.resource
       return {id, name, accounts}
    }

    async deleteClientById(id: string): Promise<boolean> {
       const response = await this.container.item(id,id).delete();
       if(!response.resource){
            throw new ResourceNotFoundError(`Client with id ${id} was not found`)
        }
       return true
    }
    
}

export const bankingDaoAzure = new BankingDaoAzure();