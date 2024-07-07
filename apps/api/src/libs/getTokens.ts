import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/config';
import { OAuth2Client, Credentials } from 'google-auth-library';

interface Credential extends Credentials {
  id?: string;
  type?: string;
}

export const getTokens = async (
  code: string,
): Promise<Credential | undefined> => {
  try {
    const oAuth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(code);

    return tokens;
  } catch (error) {
    console.error('Error fetching tokens: ', error);
    throw error;
  }
};
