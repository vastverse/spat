import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useRef, useState, useEffect} from "react";

import { Navigate } from "react-router-dom";
import "./chat.css";
import { db } from "./firebaseconnector";
import { useAppDispatch } from "./Hooks";
import Signup from './components/Signup';
import Login from './components/Login';
import { addUserDetails } from "./userreducer";
//import { v4 as uuidv4 } from "uuid";



function Home() {

  const [error, setError] = useState({
    state: "",
    message: "",
  });

  const container = useRef(null);
  const dispatch = useAppDispatch();
  const [redirect, setRedirect] = useState(false);

  /*const [userDetails, setUserDetails] = useState({
    userName: "",
    userEmail: "",
    userId: "",
    imageUrl: "",
  });*/

  const loginCallback = async (verifiedResult) => {
    //const userName = verifiedResult.email.split('@')[0];
    //const userEmail = verifiedResult.email;
    const userId = verifiedResult.userId;
    //const imageUrl = verifiedResult.photoUrl;

    try {
      const q = query(
        collection(db, "users"),
        where(
          "userId",
          "==",
          userId,)
      );
      //console.log(`User details: ${userEmail} ${userId} ${userName}`);

      const querySnapshot = await
        getDocs(q);
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        console.log(`data: ${data.userId}, ${data.userEmail}, ${data.userName}, ${data.imageUrl}`)
        dispatch(
          addUserDetails({
            id: data.userId,
            email: data.userEmail,
            name: data.userName,
            imageUrl: data.imageUrl,
            subscribed: data.subscribed,
          })
        );
        setRedirect(true);
      });

      setError({...error, state: true, message: "Data not found"});
    } catch (err) {
      setError({...error, state: true, message: "Internal server error"});
    }
  };


  const handleSubmit = event => {
    event.preventDefault();
    //setSubmitting(true);

   /* setTimeout(() => {
      setSubmitting(false);
      setUserDetails(
      	{reset: true}
      	);
    }, 3000);*/
  }

	const signupCallback = async (verifiedResult) => {

    const userName = verifiedResult.email.split('@')[0];
    const userEmail = verifiedResult.email;
    const userId = verifiedResult.userId;
    const imageUrl = verifiedResult.photoUrl;

	  try {
      if (!userEmail) {
        setError({ ...error, state: true, message: "Email not found" });
        return;
      }
      const q = query(
        collection(db, "users"),
        where("userEmail", "==", userEmail)
      );

      const querySnapshot = await getDocs(q);
      var temp = false;
      querySnapshot.forEach((doc) => {
        setError({ ...error, state: true, message: "Email account already exists" });
        temp = true;
        return;
      });

      const tempUserDetails = {
        userName: userName,
        userId: userId,
        imageUrl: imageUrl,
        userEmail: userEmail,
      }

      if (temp) return;
      addDoc(collection(db, "users"), tempUserDetails)
        .then((data) => {
          setRedirect(true);
          dispatch(
            addUserDetails({
              id: userId,
              email: userEmail,
              name: userName,
              imageUrl: imageUrl,
            })
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      setError({ ...error, state: true, message: "Internal server error" });
      console.error("Error adding document: ", e);
    }
	};

/*  const onChange = event => {
    setUserDetails({
      name: event.target.name,
			value: event.target.value,
			//[e.target.id]: [e.target.value],
    });
  };*/

/*  const onChange = (e) => {
		setUserDetails({
			...userDetails,
			[e.target.id]: [e.target.value],
		});
	};*/
	/*const onSubmitSignUp = async (e) => {
		e.preventDefault();
		try {
			if (!userDetails.userEmail) {
				setError({ ...error, state: true, message: "email id not found" });
				return;
			}
			/*if (!userDetails.userPassword) {
				setError({ ...error, state: true, message: "password not found" });
				return;
			}*
			const q = query(
				collection(db, "users"),
				where("userEmail", "==", userDetails.userEmail)
			);

			const querySnapshot = await getDocs(q);
			var temp = false;
			querySnapshot.forEach((doc) => {
				setError({ ...error, state: true, message: "Email id already exists" });
				temp = true;
				return;
			});
			if (temp) return;
			addDoc(collection(db, "users"), userDetails)
				.then((data) => {
					setRedirect(true);
					dispatch(
						addUserDetails({
							id: userDetails.userId,
							email: userDetails.userEmail[0],
							name: userDetails.userName[0],
							imageUrl: userDetails.imageUrl,
						})
					);
				})
				.catch((err) => {
					console.error(err);
				});
		} catch (e) {
			setError({ ...error, state: true, message: "Internal server error" });
			console.error("Error adding document: ", e);
		}
	};*/
	/*const onSubmitSignIn = async (e) => {
		e.preventDefault();
		if (!userDetails.userEmail || !userDetails.userPassword) {
			setError({
				...error,
				state: true,
				message: "Please try again. You did not input the required information",
			});
			return;
		}
		try {
			const q = query(
				collection(db, "users"),
				where(
					"userEmail",
					"==",
					userDetails.userEmail,
				)
			);

			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				var data = doc.data();
				dispatch(
					addUserDetails({
						id: data.userId,
						email: data.userEmail,
						name: data.userName,
						imageUrl: data.imageUrl,
						subscribed: data.subscribed,
					})
				);
				setRedirect(true);
			});
			setError({ ...error, state: true, message: "Data not found" });
		} catch (err) {
			setError({ ...error, state: true, message: "Internal server error" });
		}
	};*/
	const signInBtnEvent = () => {
		const fooBarNode = container.current;
		fooBarNode.classList.add("sign-up-mode");
	};
	const signUpBtnEvent = () => {
		const fooBarNode = container.current;
		fooBarNode.classList.remove("sign-up-mode");
	};
	useEffect(() => {
		if (window.location.protocol === "https:")
			window.location.protocol = "http:";
	});
	return (
		<div class="container" ref={container}>
			<div class="container__forms">
				<div class="form">
					<form action="" class="form__sign-in" onSubmit={handleSubmit}>
						<h2 className="form__title">Use your Google account to</h2>
						{error.state && (
							<div className="error">
								{error.message}{" "}
								<div
									onClick={() => {
										setError({ ...error, state: "" });
									}}
									className="error-cross"
								>
									+
								</div>
							</div>
						)}

            <div className="Google Signin">
              <Login parentCallback = {loginCallback} />
              <br />
            </div>

					</form>

					<form action="" class="form__sign-up" onSubmit={handleSubmit}>
						<h2 class="form__title">Use your Google account to</h2>
						{error.state && (
							<div className="error">
								{error.message}{" "}
								<div
									onClick={() => {
										setError({ ...error, state: "" });
									}}
									className="error-cross"
								>
									+
								</div>
							</div>
						)}

            <div className="Google Signup">
              <Signup parentCallback = {signupCallback} />
              <br />
            </div>
					</form>
				</div>
			</div>
			<div class="container__panels">
				<div class="panel panel__left">
					<div class="panel__content">
						<h3 class="panel__title">New here ?</h3>
						<p class="panel__paragraph">
							Spat is a global online chatting app with strangers. You can
							instantly meet people near you or all over the world
						</p>
						<button
							class="btn btn-transparent"
							onClick={signInBtnEvent}
							id="sign-up-btn"
						>
							Sign Up
						</button>
					</div>
					<img
						class="panel__image"
						src="https://stories.freepiklabs.com/storage/11588/market-launch-amico-2628.png"
						alt=""
					/>
				</div>
				<div class="panel panel__right">
					<div class="panel__content">
						<h3 class="panel__title">One of us ?</h3>
						<p class="panel__paragraph">
							Spat is a global online chatting app with strangers. You can
							instantly meet people near you or all over the world
						</p>
						<button
							class="btn btn-transparent"
							onClick={signUpBtnEvent}
							id="sign-in-btn"
						>
							Sign In
						</button>
					</div>
					<img
						class="panel__image"
						src="https://www.pngkey.com/png/full/444-4444270_ia-press-play-website.png"
						alt=""
					/>
				</div>
			</div>
			{redirect && <Navigate to="/chat" />}
		</div>
	);
}

export default Home;

/*<div class="form__input-field">
  <i class="fas fa-user"></i>
  <input
    name="userEmail"
    value={userDetails.userEmail || ''}
    onChange={onChange}
    type="text"
    placeholder="Username"
    required
  />
</div>*/