import { Application, NextFunction } from "express";
const Express = require("express");

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
        let details: Array<string> = this.createDetails(controller);

        this.app.get(
            path,
            (
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ) => {
                this.createInstance(details, req, res, next);
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
        let details: Array<string> = this.createDetails(controller);

        this.app.post(
            path,
            (
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ) => {
                this.createInstance(details, req, res, next);
            }
        );
    }

    private createInstance(
        details: Array<string>,
        req: Express.Request,
        res: Express.Response,
        next: NextFunction
    ) {
        eval(`
        const Controller = new require("${Router.path}/App/Http/Controllers/${details[0]}");
        Controller.prototype.req = req;
        Controller.prototype.res = res;
        Controller.prototype.next = next;
        Controller.prototype.${details[1]}();
    `);
    }

    private createDetails(controller: string): Array<string> {
        let details: Array<string> = controller.split("@");
        if (!details[1]) details[1] = "index";
        return details;
    }
}

export default Router;
