const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const fs = require('fs');

let envVariables = process.env.map(key => key); // stores the env variable names

// Change dir to runner home dir
try {
    process.chdir("/home/runner/work/");
} catch (err) {
    console.log(err);
}

let envFilePaths = findAllEnvFiles();

core.setOutput("files", envFilePaths);

function findAllEnvFiles() {
    let foundEnvFiles = []
    const files = fs.readdirSync(".", { recursive: true }); // reads the contents of the directory
    for(file in files) {
        file.endsWith(".env") ? foundEnvFiles.push(file) : null;
    }
    return foundEnvFiles;
}
