const userRepos = require("../api/controllers")

/**
 * Counts the number of files in a given repo tree
 * @param {JSON} j - the repo gitAPI tree
 */
const getNumOfFiles = async (j) => {
    let numOfFiles = 0;

    for (let file of j) {
        if (file.type == "blob") numOfFiles++;
    }
    return numOfFiles;
}

/**
 * Counts the number of active webhook in a given repo
 * source example: https://api.github.com/repos/<user>/<reponame>/hooks
 * @param {JSON} j - the full webhook json response from gitAPI
 */
const countActiveWebhook = async (j) => {
    if (j.length == 0) return 0
    let active_webhooks = 0
    for (let element in j) {
        if (element.active == true) active_webhooks++;
    }
    return active_webhooks;
}

/**
 * return the path of the first .yml file in a given full repo tree
 * full tree is a recursive tree of all files and subfiles in repo
 * source example: https://api.github.com/repos/<user>/<reponame>/git/trees/master?recursive=1
 * @param {JSON} j - the repo gitAPI tree
 */
const getFirstYmlPath = async (j) => {
    for (let element of j) {
        if (element.path.includes('.yml')) return (element.path).replace('New folder/', '');
    }
    return "";
}

/**
 * return the repo name
 * source example: https://api.github.com/repos/<user>/<reponame>
 * @param {JSON} j - the repo info json from gitAPI
 */
const getRepoName = async (j) => {
    return j.name;
}

/**
 * return the repo owner name
 * source example: https://api.github.com/repos/<user>/<reponame>
 * @param {JSON} j - the repo json from gitAPI
 */
const getRepoOwner = async (j) => {
    return j.owner.login;
}

/**
 * return the repo size
 * source example: https://api.github.com/repos/<user>/<reponame>
 * @param {JSON} j - the repo json from gitAPI
 */
const getRepoSize = async (j) => {
    return j.size;
}

/**
 * return true if thr repo is private, false otherwise
 * source example: https://api.github.com/repos/<user>/<reponame>
 * @param {JSON} j - the repo json from gitAPI
 */
const getRepoIsPrivate = async (j) => {
    return j.private;
}

/**
 * return the base64 decoded content of a .yml file
 * source example: https://api.github.com/repos/<user>/<reponame>/contents/
 * @param {JSON} j - the repo file gitAPI json info
 */
const getYamlContent = async (j) => {
    return atob(j.content);
}


module.exports = {
    getRepoName,
    getRepoOwner,
    getRepoSize,
    getFirstYmlPath,
    getRepoIsPrivate,
    countActiveWebhook,
    getYamlContent,
    getNumOfFiles
}



