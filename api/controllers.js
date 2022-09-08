const repositoryInfo = require("../models/parseRepositoryInfo");
const fetch = require('node-fetch');


async function getUserRepos(user) {
    console.log(user);
    let generalInfo = fetch('https://api.github.com/users/' + user + '/repos', {
        method: "GET"
    });

    generalInfo = await (await generalInfo).json();
    let repoList = [];

    for (let repo of generalInfo) {
        let newRepo = {};
        newRepo.name = await repositoryInfo.getRepoName(repo);
        newRepo.owner = await repositoryInfo.getRepoOwner(repo);
        newRepo.size = await repositoryInfo.getRepoSize(repo);
        repoList.push(newRepo);
    }

    return repoList;
}


const getRepoInfo = async (user, reponame) => {

    //make 4 API requests to git (the general info, the file tree, the webhook list and the yaml file
    //the forth requests is using a data point (the first yml file path) from the third request
    let generalInfo = fetch('https://api.github.com/repos/' + user + '/' + reponame, {
        method: "GET"
    });

    let webhooks = fetch('https://api.github.com/repos/' + user + '/' + reponame + '/hooks', {
        method: "GET",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN
        }
    });



    let fileTree = fetch('https://api.github.com/repos/' + user + '/' + reponame + '/git/trees/master?recursive=1', {
        method: "GET",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN
        }
    });

    generalInfo = await (await generalInfo).json();
    webhooks = await (await webhooks).json();
    fileTree = await (await fileTree).json();

    let ymlPath = await repositoryInfo.getFirstYmlPath(fileTree.tree);


    let firstYmlContent = fetch('https://api.github.com/repos/' + user + '/' + reponame + '/contents/' + ymlPath, {
        method: "GET",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN
        }
    });

    firstYmlContent = await (await firstYmlContent).json();

    //create the returned json
    let repoInfo = {};
    repoInfo.name = await repositoryInfo.getRepoName(generalInfo);
    repoInfo.owner = await repositoryInfo.getRepoOwner(generalInfo);
    repoInfo.size = await repositoryInfo.getRepoSize(generalInfo);
    repoInfo.private = await repositoryInfo.getRepoIsPrivate(generalInfo);
    repoInfo.numOfFiles = await repositoryInfo.getNumOfFiles(fileTree.tree);
    repoInfo.firstYmlCon = await repositoryInfo.getYamlContent(firstYmlContent);
    repoInfo.activeWebhooks = await repositoryInfo.countActiveWebhook(webhooks);

    return repoInfo;
}

const getUserReposFromAddressline = async function (req, res) {
    const user = req.params.user;
    let repoList = await getUserRepos(user);
    res.send(repoList);
}


const getRepoInfoFromAddressline = async function (req, res) {
    const user = req.params.user;
    const reponame = req.params.reponame;
    let repoList = await getRepoInfo(user, reponame);
    res.send(repoList);
}

module.exports = {getRepoInfo, getUserRepos, getUserReposFromAddressline, getRepoInfoFromAddressline}