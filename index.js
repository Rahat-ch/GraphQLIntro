const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

mongoose.connect(process.env.MONGO_URI);

const Pokemon = mongoose.model("Pokemon", {
  name: String,
  location: String
});

const typeDefs = `
  type Query {
  getAllPokemon: [Pokemon]
}

type Mutation {
  addPokemon(name: String!, location: String!): Pokemon
}

type Pokemon {
  _id: ID
  name: String!
  location: String!
}
`;
const resolvers = {
  Query: {
    getAllPokemon: async () => {
      const allPokemon = await Pokemon.find();
      return allPokemon;
    }
  },

  Mutation: {
    addPokemon: async (root, { name, location }) => {
      const newPokemon = await new Pokemon({
        name,
        location
      }).save();
      return newPokemon;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
