import { useAuth0 } from '@auth0/auth0-react';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, useCallback } from 'react';
import { GET_CURR_USER_PROFILE, GET_FOLLOWINGS } from '../graphql/queries';

interface Profile {
  id: string;
  auth0_id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

const useUser = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followingList, setFollowingList] = useState<string[]>([]);

  
  const [fetchUserProfile, { 
    data, 
    loading: profileLoading, 
    error: profileError 
  }] = useLazyQuery(GET_CURR_USER_PROFILE, {
    fetchPolicy: 'network-only', 
  });

  const [fetchFollowings, { 
    data: followingData, 
    loading: followingLoading, 
    error: followingError 
  }] = useLazyQuery(GET_FOLLOWINGS, {
    fetchPolicy: 'network-only', 
  });

  
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchUserProfile({
        variables: { auth0_id: user.sub }
      });
    }
  }, [isAuthenticated, user?.sub, fetchUserProfile]);

  
  useEffect(() => {
    if (data?.profiles?.[0]?.id) {
      fetchFollowings({
        variables: { id: data.profiles[0].id }
      });
    }
  }, [data, fetchFollowings]);

  
  useEffect(() => {
    if (data && data.profiles.length > 0) {
      setProfile(data.profiles[0]);
    }
  }, [data]);

  
  useEffect(() => {
    if (followingData) {
      const followingIds = followingData.follows.map((follow: any) => follow.following_id);
      setFollowingList(followingIds);
    }
  }, [followingData]);

  
  const refreshUserData = useCallback(() => {
    if (isAuthenticated && user?.sub) {
      fetchUserProfile({
        variables: { auth0_id: user.sub }
      });
    }
  }, [isAuthenticated, user?.sub, fetchUserProfile]);

  return {
    profile,
    followingList,
    loading: isLoading || profileLoading || followingLoading,
    error: profileError || followingError,
    isAuthenticated,
    refreshUserData, 
  };
};

export default useUser;