const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const fs = require('fs');

let envVariableNames = Object.keys(process.env).map(key => key); // stores the env variable names

const workspacePath = process.env[GITHUB_WORKSPACE];
console.log(`GitHub workspace path: ${workspacePath}`);

/**
 * Change dir to runner home dir
 */
try {
    process.chdir(workspacePath);
} catch (err) {
    console.log("Failed to change dir");
}

let envFilePaths = findAllEnvFiles();

core.setOutput("files", envFilePaths);

envFilePaths.forEach(envFile => {
    replaceEnvs(envFile);
})

/**
 * Replaces all replaceable variables with the existing env vars
 * @param file path to .env-file
 */
function replaceEnvs(file){
    fs.readFile(file, 'utf-8', function (err, data) {

        const fileContent = data.split("\n");

        const replacedContent = fileContent.map(line => {
            const [key, value] = line.split("=");
            if(envVariableNames.includes(key)) {
                return `${key}=${process.env[key]}`
            }
            else
                return line;
        })

        fs.writeFile(file, replacedContent.join("\n"), 'utf-8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function findAllEnvFiles() {
    let foundEnvFiles = []
    const files = fs.readdirSync(".", { recursive: true }); // reads the contents of the directory
    files.forEach(file => {
        file.endsWith(".env") ? foundEnvFiles.push(file) : null;
    })
    console.log("Found .env-files: " + foundEnvFiles);
    return foundEnvFiles;
}
