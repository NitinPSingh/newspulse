import { useState, useCallback, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_FOLLOWING_POSTS } from "../graphql/queries";
import NewsCard from "../components/NewsCard";
import InfiniteScroll from "react-infinite-scroll-component";
import useUser from "../hooks/useUser";
import { Post } from "../graphql/types";


export default function ConnectionNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { profile:user, followingList } = useUser()
  console.log(user,followingList)
  const FETCH_LIMIT = 5;

  const [fetchPosts, { loading }] = useLazyQuery(GET_FOLLOWING_POSTS, {
    fetchPolicy: "network-only",
  });

  const loadMorePosts = useCallback(() => {
    console.log("have been called")
    if (loading || !hasMore) return;

    fetchPosts({
      variables: {
        limit: FETCH_LIMIT,
        offset,
        id:followingList,


      },
    }).then((result) => {
      const newPosts : Post[] = result.data?.posts || [];

      if (newPosts.length < FETCH_LIMIT) {
        setHasMore(false);
      }

      setPosts((prev:Post[]) => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNewPosts];
      });
      
      setOffset(currentOffset => currentOffset + FETCH_LIMIT);
    });
  }, [fetchPosts, loading, hasMore, offset, followingList]);


  useEffect(() => {
    if (followingList?.length) {
      loadMorePosts();
    }
  }, [followingList]);


  return (
    <div className="global-news-container">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-4">
            <p>Loading connection posts...</p>
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