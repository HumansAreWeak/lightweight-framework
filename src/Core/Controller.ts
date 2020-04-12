import { Request, Response } from "express";

class Controller {
    public req: Response | undefined;
    public res: Response | undefined;
    public err: any;
}

export default Controller;
