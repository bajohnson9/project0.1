import { Request, Response } from "express";

export default function errorHandler(error: Error, req: Request, res: Response){

    if(error instanceof ResourceNotFoundError){
        res.sendStatus(404);
        res.send(error.message)
    }
    else{
        res.sendStatus(500)
        res.send('An unknown error occured')
    }

}

export class ResourceNotFoundError extends Error{

    constructor(message: string,){
        super(message);
    }
}