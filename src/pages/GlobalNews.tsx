import { useState, useCallback, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_POSTS_TAGS_USERS } from "../graphql/queries";
import NewsCard from "../components/NewsCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "../graphql/types";
const FETCH_LIMIT = 5;
export default function GlobalNews() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
  

    const isInitialLoad = useRef(true);
  
    const [fetchPosts, { loading }] = useLazyQuery(GET_ALL_POSTS_TAGS_USERS, {
      fetchPolicy: "network-only",
    });
  
    const loadMorePosts = useCallback(() => {
   
      if (loading || !hasMore) return;
  
      fetchPosts({
        variables: {
          limit: FETCH_LIMIT,
          offset: offset,
        },
      }).then((result) => {
        const newPosts: Post[] = result.data?.posts || [];
    
        setPosts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
        
        setOffset(prevOffset => prevOffset + FETCH_LIMIT);
        if (newPosts.length < FETCH_LIMIT) {
            setHasMore(false);
          }
      });
    }, [fetchPosts, loading, hasMore, offset]);
  
 
    useEffect(() => {
     
      if (isInitialLoad.current) {
        console.log("hhh")
        loadMorePosts();
        isInitialLoad.current = false;
      }
    }, []);
  return (
    <div className="global-news-container">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-4">
            <p>Loading more posts...</p>
          </div>
        }
        endMessage={
          posts.length > 0 && (
            <div className="text-center p-4">
              <p className="font-semibold">No more posts to display</p>
            </div>
          )
        }
    
      >
        {posts.map((post:any) => (
          <NewsCard key={post?.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
}