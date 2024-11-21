import React from 'react'
import { Profile } from '../graphql/types'

interface ProfilePageTopCardProps {
    profile: Profile;
    isFollow: boolean;
    following: number;
    followers: number;
    totalPosts: number;
    handleFollow: () => void;
    handleUnFollow: () => void;
    isUserAndProfileNotSame: boolean;
  }
  
const ProfilePageTopCard: React.FC<ProfilePageTopCardProps> = ({
    profile,
    isFollow,
    following,
    followers,
    handleFollow,
    handleUnFollow,
    isUserAndProfileNotSame,
    totalPosts
  }) => {
  return (
    <div className="flex flex-wrap mb-6 xl:flex-nowrap">
          <div className="mb-5 mr-5">
            <div className="relative inline-block shrink-0 rounded-2xl">
              <img
                className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]"
                src={profile.avatar_url || "https://via.placeholder.com/160"}
                alt={profile.username || "User Avatar"}
              />
            </div>
          </div>
          <div className="grow">
            <div className="flex flex-wrap items-start justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-2xl mr-1">
                    {profile.username || "Anonymous"}
                  </p>
                </div>
                <div className="flex flex-wrap pr-2 mb-4 font-medium">
                  <p className="flex items-center mb-2 mr-5">
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {"India"}
                  </p>
                  <a
                    className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary"
                    href={`mailto:${profile.email}`}
                  >
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </span>
                    {profile.email || "No Email"}
                  </a>
                </div>
              </div>
              {isUserAndProfileNotSame && !isFollow  &&(
                <div className="my-auto">
                  <button
                    onClick={handleFollow}
                    className="px-6 py-3 mr-3 text-base font-medium leading-normal text-white text-center align-middle cursor-pointer rounded-2xl bg-pulse border-light"
                  >
                    Follow
                  </button>
                </div>
              )}
              {isFollow &&
              <div className="my-auto">
              <button
                onClick={handleUnFollow}
                className="px-6 py-3 mr-3 text-base font-medium leading-normal text-white text-center align-middle cursor-pointer rounded-2xl bg-pulse border-light"
              >
                Unfollow
              </button>
            </div>
              }
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-wrap items-center">
                <p
                  className="mr-3 mb-2 inline-flex items-center justify-center text-pulse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal"
                >
                 {followers} Following
                </p>
                <p
                  className="mr-3 mb-2 inline-flex items-center justify-center text-pulse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal"
                >
                   {following} Followers
                </p>
                <p
                  className="mr-3 mb-2 inline-flex items-center justify-center text-pulse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal"
                >
                  {totalPosts} Posts
                </p>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ProfilePageTopCard