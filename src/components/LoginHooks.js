import React, {useState} from 'react';
import { useGoogleLogin } from 'react-google-login';

// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';
import  {googleAuth} from "../utils/googleAuth";

const clientId = process.env.REACT_APP_CLIENT_ID;

function LoginHooks(props) {

  const onSuccess = async (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `User ${res.profileObj.name} logged in successfully.`
    );
    refreshTokenSetup(res);

    // token confirmation
    //console.log(googleAuth(res.tokenId));
    let verifiedResult = await googleAuth(res.tokenId);

    props.parentCallback({
      userName: res.profileObj.userName,
      userEmail: verifiedResult.email,
      userId: verifiedResult.userId,
      imageUrl: verifiedResult.photoUrl,
    })
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login.`
    );
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  });

  return (
    <button onClick={signIn} className="button">
      <img src="icons/google.svg" alt="google login" className="icon"></img>

      <span className="buttonText">Sign in with Google</span>
    </button>
  );
}

export default LoginHooks;