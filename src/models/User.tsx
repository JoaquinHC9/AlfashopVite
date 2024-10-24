//user.tsx
export type UserProfileToken = {
    userName: string;
    email: string;
    token: string;
  };
  
  export type UserProfile = {
    userName: string;
    email: string;
  };
  export type UserRegister = {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    roleList: string[];
};