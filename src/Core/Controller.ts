import { Request, Response, NextFunction, Application } from "express";

class Controller {
    public req: Request | undefined;
    public res: Response | undefined;
    public next: NextFunction | undefined;
    public application: Application | undefined;
}

export default Controller;
