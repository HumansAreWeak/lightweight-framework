/**
 *   [Main Index File]
 *   This file is mainly used for pre configure everything and to return
 *   the desired Classes for Inheritance
 */

import ReController from "./Core/Controller";
import ReRouter from "./Core/System/Router";
import { Application, Response, Request } from "express";
import StartUpInterface from "./Interfaces/Index_StartUp";

/**
 * [Variable Section]
 * Some constant variables are created here
 * that are used to be passed around.
 */
const express = require("express");
const app: Application = express();
const router = new ReRouter(app);
const chalk = require("chalk");
const internalIp = require("internal-ip");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

/**
 *   [Exports Section]
 *   Exports everything that needs to be exported
 */
export const Controller = ReController;

export const Router: ReRouter = router;

module.exports.StartUp = (params: StartUpInterface) => {
    if (!params.port) params.port = 4001;

    if (params.env == "development") {
        app.use(cors());
    }

    ReRouter.path = params.path.replace(/\\/g, "/");

    require(params.path + "/Web/Routes.js");

    app.get("*", (req: Request, res: Response) => {
        if (!res.headersSent) {
            res.status(404).send(
                JSON.stringify({
                    status: 404,
                    message: "The page you are looking for was not found.",
                })
            );
        }
    });

    if (params.publicFolder) {
        if (fs.existsSync(params.path + "../" + params.publicFolder)) {
            fs.mkdirSync(params.publicFolder);
        }
        app.use(express.static(params.publicFolder));
    }

    app.listen(params.port, () => {
        console.clear();
        console.log(
            chalk.blue("[Lightweight Framework]") +
                "\n\n" +
                "[Project] " +
                chalk.green(params.name) +
                "\n" +
                "[Status] " +
                chalk.green("Server started") +
                "\n" +
                "[Local] " +
                chalk.yellow("http://localhost:" + params.port + "/") +
                "\n" +
                "[Network] " +
                chalk.yellow(
                    "http://" + internalIp.v4.sync() + ":" + params.port + "/"
                ) +
                "\n\n" +
                chalk.red("To Stop the Server, press ") +
                chalk.bold.red("CTRL + C") +
                chalk.red(" (Windows)")
        );
    });
};
