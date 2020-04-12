import Controller from "./Core/Controller";
import Router from "./Core/System/Router";
import { Application } from "express";
import StartUpInterface from "./Interfaces/Index_StartUp";

const express = require("express");
const app: Application = express();
const router = new Router(app);
const chalk = require("chalk");

require("dotenv").config();

module.exports.Controller = Controller;

module.exports.Router = router;

module.exports.StartUp = (path: string) => {
    Router.path = path.replace(/\\/g, "/");

    require(path + "/Web/Routes.js");

    app.listen(4001, () => {
        console.clear();
        console.log(
            chalk.blue("[Lightweight Framework]") +
                "\n\n" +
                "[Project] " +
                chalk.green("Test") +
                "\n" +
                "[Status] " +
                chalk.green("Server started") +
                "\n" +
                "[Local] " +
                chalk.yellow("http://localhost:4001/") +
                "\n" +
                "[Network] " +
                chalk.yellow("http://12931283912839128391283:4001/")
        );
    });

    return (params: StartUpInterface) => {
        console.log(params);
    };
};
