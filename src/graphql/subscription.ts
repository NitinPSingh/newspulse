import { gql } from '@apollo/client';

export const SUB_POFILE_STAT = gql`
subscription MyQuery($id: uuid!) {
  profiles(where: {id: {_eq: $id}}) {
    follower_id_aggregate(distinct_on: follower_id, where: {follower_id: {_eq: $id}}) {
      aggregate {
        count
      }
    }
    following_id_aggregate(distinct_on: following_id, where: {following_id: {_eq: $id}}) {
      aggregate {
        count
      }
    }
    posts_aggregate(where: {author_id: {_eq: $id}}) {
      aggregate {
        count
      }
    }
    posts(where: {author_id: {_eq: $id}}) {
      author_id
      context
      heading
      created_at
      id
      image_url
    }
  }
}

`
