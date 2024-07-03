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
      "839845136676-ntkgv48oeubdgvgnblaejejkfc8rs6kp.apps.googleusercontent.com",
      "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",
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(code);

    return tokens;
  } catch (error) {
    console.error('Error fetching tokens: ', error);
    throw error;
  }
};
