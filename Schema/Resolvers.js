const controllers = require('../api/controllers');
const throttle = require("../models/throttling");


const resolvers = {
    Query: {
        getUserRepos: (parent, args, context, info) => {
            return controllers.getUserRepos(args.user);
        },
        getRepoInfo: throttle.throttle((parent, args, context, info) => {
            return controllers.getRepoInfo(args.user, args.repoName);
        }, 2, 500)
    }
}

module.exports = {resolvers};