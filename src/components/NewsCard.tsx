
import { useNavigate } from "react-router-dom";
interface Post {
    id: string;
    heading: string;
    context: string;
    image_url?: string; 
    updated_at: string;
  }
export default function NewsCard({ post }: { post: Post }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/post/${post.id}`);
    };
  
  return (
    <div className="flex text-left items-center w-full shadow-sm border border-slate-200 rounded-l mb-4 p-2"
    onClick={handleCardClick}
    >
      <div className="h-[150px] w-[30%] flex items-center">
    <img
      src={post.image_url || "https://via.placeholder.com/160"}
      className="object-cover h-full w-full rounded"
      alt="Post Thumbnail" />
    </div>
     
      <div className="relative flex flex-col  bg-white w-[80%]">
      
      
        <div className="p-4">
          <h5 className="mb-2 text-slate-800 text-xl font-semibold">
            {post.heading.length > 50 
              ? `${post.heading.slice(0, 50)}...` 
              : post.heading}
          </h5>
          <p 
            className="text-slate-600 leading-normal font-light" 
            dangerouslySetInnerHTML={{
              __html: post.context.length > 250 
                ? `${post.context.slice(0, 250)}...` 
                : post.context
            }}
          />
        </div>

        <div className="mx-3 border-t border-slate-200 pb-3 pt-2 px-1">
          <span className="text-sm text-slate-600 font-medium">
            Last updated: {new Date(post.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
