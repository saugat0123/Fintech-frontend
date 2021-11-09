const path = require('path');
const fs = require('fs');
const util = require('util');

// get application version from package.json
const appVersion = require('../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
console.log('\nRunning post-build tasks');

// our version.json will be in the dist folder
const versionFilePath = path.join(__dirname + '/../dist/sb-frontend/version.json');
let mainHash = '';
let mainBundleFile = '';

// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main[-]([a-z0-9]*).([a-z0-9]*).js$/;

function makeId(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// read the dist folder files and find the one we're looking for
readDir(path.join(__dirname, '/../dist/sb-frontend/'))
    .then(files => {
        console.log('files: ', files);
        console.log('mainBundleRegexp', mainBundleRegexp);
        mainBundleFile = files.find(f => mainBundleRegexp.test(f));
        if (mainBundleFile) {
            let matchHash = mainBundleFile.match(mainBundleRegexp);
            console.log('matchhash: ', matchHash);
            // if it has a hash in it's name, mark it down
            if (matchHash.length > 1 && !!matchHash[2]) {
                mainHash = matchHash[2];
            }
            const generatedHash = makeId(20);
            if (generatedHash) {
                mainHash = generatedHash;
            }
        }
        console.log('main bundle file: ', mainBundleFile);
        console.log(`Writing version and hash to ${versionFilePath}`);
        console.log('main hash: ', mainHash);

        // write current version and hash into the version.json file
        const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;
        return writeFile(versionFilePath, src);
    }).then(() => {
        // main bundle file not found, dev build?
        if (!mainBundleFile) {
            return;
        }
        console.log(`Replacing hash in the ${mainBundleFile}`);

        // replace hash placeholder in our main.js file so the code knows it's current hash
        const mainFilepath = path.join(__dirname, '/../dist/sb-frontend/', mainBundleFile);

        return readFile(mainFilepath, 'utf8')
            .then(mainFileData => {
                console.log('mainFilepath', mainFilepath);
                const replacedFile = mainFileData.replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash);
                return writeFile(mainFilepath, replacedFile);
            });
    }).catch(err => {
        console.log('Error with post build:', err);
    });
