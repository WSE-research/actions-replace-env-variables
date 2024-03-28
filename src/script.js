const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const fs = require('fs');

let envVariableNames = Object.keys(process.env).map(key => key); // stores the env variable names

const workspacePath = process.env.GITHUB_WORKSPACE;
console.log(`GitHub workspace path: ${workspacePath}`);

// Change dir to runner home dir
try {
    process.chdir(workspacePath);
} catch (err) {
    console.log(err);
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
        let replaced = data;
        envVariableNames.forEach(envVariable => {
            replaced.includes(envVariable) ?
                replaced = replaced.replace(envVariable, process.env[envVariable])
                :
                null;
        })
        fs.writeFile(file, replaced, function (err) {
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
