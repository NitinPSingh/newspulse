import { gql } from '@apollo/client';


export const  GET_CURR_USER_PROFILE = gql`
  query GetUserProfile($auth0_id: String!) {
    profiles(where: { auth0_id: { _eq: $auth0_id } }) {
      id
      auth0_id
      email
      username
      full_name
      avatar_url
    }
  }
`;
export const GET_PROFILE_BY_USERNAME = gql`
    query GetProfileByUsername($username: String!) {
      profiles(where: { username: { _eq: $username } }) {
        id
        username
        full_name
        avatar_url
        email
      }
    }
  `;

  export const GET_PROFILE_DETAILS = gql`
  query MyQuery($id: uuid!) {
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
    posts(order_by: {created_at: desc}, where: {author_id: {_eq: $id}}) {
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
export const GET_FOLLOWER_COUNT = gql`
  query GetFollowerCount($id: uuid!) {
    follows_aggregate(where: { following_id: { _eq: $id } }) {
        aggregate {
        count(distinct: true)
        }
    }
   }

  `

export const GET_FOLLOWING_COUNT = gql`
  query GetFollowingCount($id: uuid!) {
  follows_aggregate(where: { follower_id: { _eq: $id } }) {
    aggregate {
      count(distinct: true)
    }
  }
}`


export const GET_FOLLOWINGS = gql`
   query GetFollowings ($id: uuid!) {
  follows(where: {follower_id: {_eq: $id}}) {
    following_id
  }
}`

export const GET_FOLLOWING_POSTS = gql`
  query GetFollowingPosts($id: [uuid!], $limit: Int!, $offset: Int!) {
  posts(where: {author_id: {_in: $id}}, limit: $limit, offset: $offset, order_by: {created_at: desc}) {
    context
    created_at
    heading
    id
    image_url
    author_id
  }
}
`;

export const IS_FOLLOWING = gql`
query IsFollowing($currentUserId: uuid!, $targetUserId: uuid!) {
  follows(where: {follower_id: {_eq: $currentUserId}, following_id: {_eq: $targetUserId}}) {
    follower_id
    following_id
  }
}

`

export const GET_ALL_POSTS_TAGS_USERS = gql`
  query GetAllPosts($limit: Int!, $offset: Int!) {
    posts(order_by: {created_at: desc}, limit: $limit, offset: $offset) {
      author_id
      context
      created_at
      heading
      id
      image_url
      post_tags {
        tag {
          name
        }
      }
      profile {
        avatar_url
        email
        id
        username
      }
      updated_at
    }
  }
`;


export const GET_POST_BY_ID = gql`
query GetPostById($id: uuid!) {
  posts_by_pk(id: $id) {
    author_id
    context
    created_at
    heading
    id
    image_url
    post_tags {
      tag {
        id
        name
      }
    }
    profile {
      avatar_url
      email
      username
    }
  }
}
`;
