const chalk = require("chalk");
const arg = require("arg");
const fs = require("fs");
const shelljs = require("shelljs");

function BeginCLI(): any {
    return "\n" + chalk.blue("[Lightweight Framework Commands]") + "\n";
}

function MakeList(): any {
    return (
        chalk.bgWhiteBright.black("\xa0- Make -\xa0") +
        "\xa0" +
        chalk.whiteBright("lwf --make --help") +
        "\n" +
        chalk.yellow("lwf --make controller") +
        chalk.bold.grey(" <Controller Name>") +
        "\n" +
        chalk.yellow("lwf --make model") +
        chalk.bold.grey(" <Model Name>")
    );
}

function PassArgumentsToOptions(rawArgs: any): any {
    const args = arg(
        {
            "--help": Boolean,
            "--make": Boolean,
            "--init": Boolean,
            "-m": "--make",
            "-h": "--help",
            "-i": "--init",
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    return {
        help: args["--help"] || false,
        make: args["--make"] || false,
        init: args["--init"] || false,
        template: args._[0],
        name: args._[1],
    };
}

export function main(args: any): void {
    const options = PassArgumentsToOptions(args);

    if (!options.make && !options.help && !options.init) {
        console.log(
            BeginCLI() +
                "\n" +
                "Get further information by entering: lwf --help (-h)" +
                "\n"
        );
    } else if (options.help) {
        if (!options.make) {
            console.log(
                BeginCLI() +
                    "\n" +
                    chalk.bgWhiteBright.black("\xa0- Help Section -\xa0") +
                    "\n\n" +
                    "Initialize Project: " +
                    chalk.green("lwf --init") +
                    "\n\n" +
                    MakeList() +
                    "\n" +
                    "\n" +
                    "Every command can be shortened just by using a single hyphen (-) followed by the start letter (e.g. --help => -h)." +
                    "\n"
            );
        } else if (options.make) {
            console.log(
                BeginCLI() +
                    "Make is used for creating automatically needed files for your project. The syntax is easy and mostly straight forward." +
                    "\n\n" +
                    MakeList() +
                    "\n"
            );
        }
    } else if (options.init) {
        console.log(
            "\n" +
                chalk.yellow(
                    "LWF is now initializing your project, please be patient..."
                )
        );

        if (!fs.existsSync("./package.json")) {
            shelljs.exec("npm init -y");
        }

        fs.readFile("package.json", "utf8", (err: any, data: any) => {
            if (err) throw err;

            data = JSON.parse(data);
            data.scripts = {
                dev: "nodemon ./src/index.js",
            };

            fs.writeFile("package.json", JSON.stringify(data), (err: any) => {
                if (err) throw err;
            });
        });

        mkDir("src");
        mkDir("src/App");
        mkDir("src/App/Http");
        mkDir("src/App/Http/Controllers");
        mkDir("src/App/Http/Models");
        mkDir("src/Web");

        createFile(
            "./src/Web/Routes.js",
            'const Router = require("@humansareweak/lightweight-framework").Router;' +
                "\n\n" +
                'Router.get("/", "ExampleController@index");\n'
        );

        createFile(
            "./src/App/Http/Controllers/ExampleController.js",
            'const Controller = require("@humansareweak/lightweight-framework").Controller;' +
                "\n\n" +
                "class ExampleController extends Controller {" +
                '\n\tindex() {\n\t\tthis.res.send("Hello from Lightweight Framework!");\n\t}\n}\n\n' +
                "module.exports = ExampleController;\n"
        );

        createFile(
            "./src/index.js",
            'require("@humansareweak/lightweight-framework").StartUp({\n\t' +
                `path: __dirname,
    name: process.env.PROJECT_NAME,
    publicFolder: process.env.PUBLIC_FOLDER,
    env: process.env.NODE_ENV,
    port: process.env.PORT,` +
                "\n});\n"
        );

        createFile(
            ".env",
            "PROJECT_NAME=Lightweight Framework\nPUBLIC_FOLDER=public\nNODE_ENV=development\nPORT=4001"
        );

        console.log(
            "\n" +
                chalk.green(
                    "LWF has successfully initialized your project. Make something with it!"
                ) +
                "\n"
        );
    } else if (options.make) {
        if (!options.template) {
            console.log("lwf --make --help");
        } else {
            if (options.name) {
                if (options.template == "controller") {
                    createController(options.name);
                    console.log(
                        chalk.bold.green(
                            options.name + " was successfully created!"
                        )
                    );
                }
            } else {
                console.log("lwf --make --help");
            }
        }
    }
}

function createController(controllerName: string) {
    createFile(
        "./src/App/Http/Controllers/" + controllerName + ".js",
        'const Controller = require("@humansareweak/lightweight-framework").Controller;' +
            "\n\n" +
            "class " +
            controllerName +
            " extends Controller {" +
            "\n\t\n}\n\n" +
            "module.exports = " +
            controllerName +
            ";\n"
    );
}

function mkDir(dirname: string): void {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
}

function createFile(filename: string, content: string) {
    if (!fs.existsSync(filename)) {
        fs.writeFile(filename, content, (err: any) => {
            if (err) throw err;
        });
    }
}
