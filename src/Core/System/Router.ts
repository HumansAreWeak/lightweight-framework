import { Application, NextFunction, Request, Response } from "express";

class Router {
    public static path: string = "";
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    /**
     * GET Request to a specified URL. Will response with corresponding Controller.
     * @param path
     * @param controller
     * @returns void
     */
    public get(path: string, controller: string) {
        this.app.get(
            path,
            (req: Request, res: Response, next: NextFunction) => {
                this._createInstance(controller, req, res, next);
            }
        );
    }

    /**
     * POST Request to a specified URL. Will response with corresponding Controller.
     * @param path
     * @param controller
     * @returns void
     */
    public post(path: string, controller: string) {
        this.app.post(
            path,
            (req: Request, res: Response, next: NextFunction) => {
                this._createInstance(controller, req, res, next);
            }
        );
    }

    /**
     * ALL Requests to a specified URL. Will response with corresponding Controller.
     * @param path
     * @param controller
     * @returns void
     */
    public all(path: string, controller: string) {
        this.app.all(
            path,
            (req: Request, res: Response, next: NextFunction) => {
                this._createInstance(controller, req, res, next);
            }
        );
    }

    /**
     * DELETE Request to a specified URL. Will response with corresponding Controller.
     * @param path
     * @param controller
     * @returns void
     */
    public delete(path: string, controller: string) {
        this.app.delete(
            path,
            (req: Request, res: Response, next: NextFunction) => {
                this._createInstance(controller, req, res, next);
            }
        );
    }

    /**
     * PUT Request to a specified URL. Will response with corresponding Controller.
     * @param path
     * @param controller
     * @returns void
     */
    public put(path: string, controller: string) {
        this.app.put(
            path,
            (req: Request, res: Response, next: NextFunction) => {
                this._createInstance(controller, req, res, next);
            }
        );
    }

    private _createInstance(
        controller: string,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        let details: Array<string> = this._createDetails(controller);

        eval(`
        const Controller = new require("${Router.path}/App/Http/Controllers/${details[0]}");
        Controller.prototype.application = ${this.app};
        Controller.prototype.req = ${req};
        Controller.prototype.res = ${res};
        Controller.prototype.next = ${next};
        Controller.prototype.${details[1]}();
    `);
    }

    private _createDetails(controller: string): Array<string> {
        let details: Array<string> = controller.split("@");
        if (!details[1]) details[1] = "index";
        return details;
    }
}

export default Router;
