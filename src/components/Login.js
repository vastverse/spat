import React from 'react';

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';
import {googleAuth} from "../utils/googleAuth";

const clientId = process.env.REACT_APP_CLIENT_ID;

function Login(props) {
  const onSuccess = async (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    //alert(
    //  `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    //);
    refreshTokenSetup(res);

    let verifiedResult = await googleAuth(res.tokenId);

    //console.log(res.profileObj)
    props.parentCallback(verifiedResult);

  };

  const onFailure = (res) => {
    //console.log('Login failed: res:', res);
    alert(
      `Failed to sign in. Please use one of your Google accounts to sign in.`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign In"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={false}
      />
    </div>
  );
}

export default Login;
