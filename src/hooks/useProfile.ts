import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GET_PROFILE_BY_USERNAME,
  GET_PROFILE_DETAILS,
  IS_FOLLOWING,
} from "../graphql/queries";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations";
import useUser from "./useUser";

export const useProfile = (username: string) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [postList, setPostList] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const {profile} = useUser()

  
  const { data: profileData, loading: profileLoading, error: profileError } = useQuery(
    GET_PROFILE_BY_USERNAME,
    {
      variables: { username },
      onCompleted: (data) => {
        const id = data?.profiles?.[0]?.id;
        if (id) setUserId(id);
      },
    }
  );

  
  const { refetch: refetchProfileDetails } = useQuery(GET_PROFILE_DETAILS, {
    variables: { id: userId },
    skip: !userId, 
    onCompleted: (data) => {
        console.log(data,":fggd")
      setFollowers(data?.profiles?.[0]?.follower_id_aggregate?.aggregate?.count || 0);
      setFollowing(data?.profiles?.[0]?.following_id_aggregate?.aggregate?.count || 0);
      setTotalPosts(data?.profiles?.[0]?.posts_aggregate?.aggregate?.count || 0);
      setPostList(data?.profiles?.[0]?.posts || []);
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true 
  });

  

  const { refetch:refreshIsFollow } = useQuery(IS_FOLLOWING, {
    variables: { currentUserId: profile?.id, targetUserId: userId },
    skip: !userId,
    onCompleted: (data) => {
        console.log(data)
      setIsFollowing(data?.follows?.length > 0); 
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  });

  const [followUser] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      refetchProfileDetails(); 
      refreshIsFollow();
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    onCompleted: () => {
      refetchProfileDetails(); 
      refreshIsFollow();
    },
  });


  
  useEffect(() => {
    if (userId) {
      refetchProfileDetails();
    }
  }, []);

  return {
    profile: profileData?.profiles?.[0],
    followers,
    following,
    totalPosts,
    postList,
    isFollowing,
    loading: profileLoading,
    error: profileError,
    followUser: (followerId: string, followingId: string) =>
      followUser({ variables: { followerId, followingId } }),
    unfollowUser: (followerId: string, followingId: string) =>
        unfollowUser({ variables: { followerId, followingId } })
  };
};
