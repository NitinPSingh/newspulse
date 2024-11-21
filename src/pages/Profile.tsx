import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import useUser from "../hooks/useUser";
import NewsCard from "../components/NewsCard";
import ProfilePageTopCard from "../components/ProfilePageTopCard";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();


  if (!username) {
    return <div>Username parameter is missing</div>;
  }

  const { 
    profile, 
    followers, 
    following, 
    totalPosts, 
    postList, 
    loading, 
    error, 
    followUser,
    unfollowUser,
    isFollowing 
  } = useProfile(username);
  
  const { profile: user } = useUser();
  const handleFollow = useCallback(() => {
    if (profile?.id && user?.id) {
      followUser(user.id, profile.id);
    }
  }, [followUser, profile?.id, user?.id]);
  
  const handleUnFollow = useCallback(() => {
    if (profile?.id && user?.id) {
      unfollowUser(user.id, profile.id);
    }
  }, [unfollowUser, profile?.id, user?.id]);

  const isFollow = useMemo<boolean>(()=>isFollowing,[isFollowing])

  useEffect(()=>{
    console.log("rendered")
  },[handleFollow,handleUnFollow,profile,followers,isFollowing ])
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error! ${error.message}`}</div>;
  if (!profile) {
    return <div>No user found with username: {username}</div>;
  }
  const isUserAndProfileNotSame = user ? user.id !== profile?.id :false
  console.log(followers,isFollow,following)
  return (
    <div className="relative flex flex-col w-full border rounded-2xl">
      <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
        <ProfilePageTopCard 
        profile={profile}
        isFollow={isFollow}
        followers={followers}
        following={following}
        handleFollow={handleFollow}
        handleUnFollow={handleUnFollow}
        isUserAndProfileNotSame={isUserAndProfileNotSame}
        totalPosts={totalPosts}
        
        />
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          {postList.length > 0 ? (
            postList.map((post) => (
              
              <NewsCard post={post}/>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
