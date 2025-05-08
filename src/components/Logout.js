import { Auth } from 'aws-amplify';

const handleLogout = async () => {
  try {
    await Auth.signOut();
    console.log('User signed out');
    // Optionally redirect to login
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
