import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: awsConfig.Auth.userPoolId,
      userPoolClientId: awsConfig.Auth.userPoolWebClientId,
      loginWith: undefined // Explicitly disable if not using OAuth
    }
  }
};

Amplify.configure(amplifyConfig);