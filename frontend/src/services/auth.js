import axios from '../api/axios';

export const signIn = async () => {
  try {
    // Gets authentication url from backend server
    const {
      data: { url },
    } = await axios.get(`${process.env.PUBLIC_URL}/oauth/url`);
    // Navigate to consent screen
    window.location.assign(url);
  } catch (err) {
    console.error(err);
  }
};

export const logout = async () => {
  try {
    // Gets authentication url from backend server
    await axios.get(`${process.env.PUBLIC_URL}/auth/logout`);
    // Navigate to landing
    window.location.assign('/');
  } catch (err) {
    console.error(err);
  }
};
