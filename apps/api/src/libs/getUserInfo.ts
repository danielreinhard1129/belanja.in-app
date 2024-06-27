import axios from 'axios';

interface UserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const getUserInfo = async (access_token: string) => {
  try {
    const { data } = await axios.get<UserInfo>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return data;
  } catch (error) {
    throw error;
  }
};
