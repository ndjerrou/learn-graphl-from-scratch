const graphql = require("graphql");
const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
  { id: "23", firstName: "Bill", age: 23 },
  { id: "25", firstName: "Tom", age: 33 },
];

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: [UserType],
      resolve(parentValue, args) {
        return axios(`http://localhost:3000/companies/${parentValue.id}/users`)
          .data;
      },
    },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        return (
          await axios.get(
            `http://localhost:3000/companies/${parentValue.companyId}`
          )
        ).data;
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        return (await axios.get(`http://localhost:3000/users/${args.id}`)).data;
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        return (await axios.get(`http://localhost:3000/companies/${args.id}`))
          .data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
