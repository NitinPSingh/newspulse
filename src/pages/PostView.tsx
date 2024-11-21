import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../hooks/usePosts";


const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const {getPostsByPostId} = usePost()


  const { posts :data, loading, error } = getPostsByPostId(id)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data?.posts_by_pk;

  if (!post) return <p>Post not found.</p>;
  const handleClick = () => {
    navigate(`/profile/${post.profile?.username}`);
  };


  return (
    <div className="p-6 max-w-4xl mx-auto text-left">

      <div className="w-full h-64 mb-4">
        <img
          src={post.image_url || "default_image_url.jpg"}
          alt={post.heading}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{post.heading}</h1>

      <p className="text-sm text-gray-600 mb-4">
        Created at: {new Date(post.created_at).toLocaleString()}
      </p>

      <div className="flex items-center mb-4 pointer" onClick={handleClick}>
        {post.profile?.avatar_url && (
          <img
            src={post.profile.avatar_url}
            alt={post.profile.username}
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <p className="text-lg font-medium"> {post.profile?.username}</p>
      </div>

      <div
        className="text-base text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: post.context }}
      ></div>

      {post.post_tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.post_tags.map((tag: any) => (
            <span
              key={tag.tag.id}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag.tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostView;
