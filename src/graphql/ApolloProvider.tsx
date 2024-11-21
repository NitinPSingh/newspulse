import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const httpsLink = new HttpLink({
  uri: `${supabaseUrl}`,
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': `${supabaseAnonKey}` 
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: `${supabaseUrl.replace(/^http/, 'ws')}`,
}));


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, 
  httpsLink 
);


const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});


const MyApolloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default MyApolloProvider;
