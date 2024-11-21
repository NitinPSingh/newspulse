import { useMutation, useQuery } from '@apollo/client';
import { CREATE_POST, CREATE_POST_TAG, CREATE_TAG } from '../graphql/mutations';
import { GET_POST_BY_ID } from '../graphql/queries';

// interface Tag {
//   id: string;
//   name: string;
// }

// interface Post {
//   id: string;
//   context: string;
//   heading: string;
//   image_url?: string;
//   author_id: string;
//   created_at: string;
//   tags?: Tag[];
// }

interface CreatePostData {
  heading: string;
  context: string;
  imageUrl?: string;
  tags: string[]; 
}



export const usePost = () => {
  
  const [createPostMutation] = useMutation(CREATE_POST);
  const [createTagMutation] = useMutation(CREATE_TAG);
  const [createPostTagMutation] = useMutation(CREATE_POST_TAG);

  
  const createPost = async (postData: CreatePostData, authorId: any) => {
  
    try {
      
      const { data: postDataRes } = await createPostMutation({
        variables: {
          heading: postData.heading,
          context: postData.context,
          image_url: postData.imageUrl,
          author_id: authorId
        }
      });
      
      const newPost = postDataRes.insert_posts_one;

      
      const tagPromises = postData.tags.map(async (tagName) => {
        
        const { data: tagData } = await createTagMutation({
          variables: {
            name: tagName.toLowerCase()
          }
        });
        
        const tag = tagData.insert_tags_one;

        
        await createPostTagMutation({
          variables: {
            post_id: newPost.id,
            tag_id: tag.id
          }
        });

        return tag;
      });

      const tags = await Promise.all(tagPromises);

      return {
        ...newPost,
        tags
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  
  const getPostsByPostId = (userId?: string) => {
    const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
      variables: { id: userId },
      fetchPolicy: 'network-only'
    });

    const posts = data?.posts?.map((post: any) => ({
      ...post,
      tags: post?.post_tags?.map((pt: any) => pt.tag)
    })) || [];

    return {
      posts,
      loading,
      error,
      refetch
    };
  };

  return {
    createPost,
    getPostsByPostId
  };
};