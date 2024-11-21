export interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
    followers_aggregate: {
      aggregate: {
        count: number;
      };
    };
    following_aggregate: {
      aggregate: {
        count: number;
      };
    };
  }
  
  export interface PostByPk {
    id: string;
    context: string;
    heading: string;
    image_url: string | null;
    created_at: string;
    author: Profile;
    tags: {
      tag: {
        id: string;
        name: string;
      };
    }[];
  }
  
  export interface Post {
    context: string;
    created_at: string;
    heading: string;
    id: string; 
    image_url: string | null;
    author_id: string; 
  }