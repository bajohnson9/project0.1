export interface Account{

    aid: string
    balance: number
    type: "Checking" | "Savings"

}

export interface Client{

    id: string
    name: string 
    accounts: Account[]

}