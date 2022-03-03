// token confirmation

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_CLIENT_ID);

export const googleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const { sub, email, name, picture } = payload;
  const userId = sub;
  return {userId, email, fullname: name, photoUrl: picture};
};