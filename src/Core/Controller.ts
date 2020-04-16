import { Request, Response, NextFunction } from "express";

class Controller {
    public req: Response | undefined;
    public res: Response | undefined;
    public next: NextFunction | undefined;
}

export default Controller;
