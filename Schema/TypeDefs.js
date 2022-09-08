const {gql} = require('apollo-server-express')

const typeDefs = gql`
        type Repository {
            name: String!
            size: Int!
            owner: String!
        }
    
        type RepositoryInfo {
            name: String!
            size: Int!
            owner: String!
            private: Boolean!
            numOfFiles: Int!
            firstYmlCon: String!
            activeWebhooks: Int!
        }
        
    
        #Queries:
        type Query{
            getUserRepos(user: String!) : [Repository!]!
            getRepoInfo(user: String!, repoName: String!): RepositoryInfo!
        }
`;

module.exports = {typeDefs};