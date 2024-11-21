import { gql } from '@apollo/client';


export const FOLLOW_USER = gql`
mutation FollowUser($followerId: uuid!, $followingId: uuid!) {
  insert_follows_one(object: { follower_id: $followerId, following_id: $followingId }) {
    follower_id
    following_id
  }
}

`

export const UNFOLLOW_USER = gql`
mutation UnfollowUser($followerId: uuid!, $followingId: uuid!) {
  delete_follows(where: {follower_id: {_eq: $followerId}, following_id: {_eq: $followingId}}) {
    affected_rows
  }
}
`


export const CREATE_POST = gql`
  mutation CreatePost($heading: String!, $context: String!, $image_url: String, $author_id: uuid!) {
    insert_posts_one(object: {
      heading: $heading,
      context: $context,
      image_url: $image_url,
      author_id: $author_id
    }) {
      id
      heading
      context
      image_url
      author_id
      created_at
    }
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($name: String!) {
    insert_tags_one(
      object: { name: $name }
      on_conflict: { 
        constraint: tags_name_key,
        update_columns: [] 
      }
    ) {
      id
      name
    }
  }
`;

export const CREATE_POST_TAG = gql`
  mutation CreatePostTag($post_id: uuid!, $tag_id: uuid!) {
    insert_post_tags_one(object: {
      post_id: $post_id,
      tag_id: $tag_id
    }) {
      post_id
      tag_id
    }
  }
`;
