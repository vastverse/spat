import {
	collection,
	getDocs,
	query,
	where,
	doc,
	updateDoc,
} from "firebase/firestore";

import React, { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router";

import {} from "firebase/firestore";

import "./chat.css";
import { db } from "./firebaseconnector";

import { useAppDispatch, useAppSelector } from "./Hooks";

import { CloseIcon, SendMessageIcon } from "./icons";
import {
	addChatDetails,
	addUserDetails,
	selectUserDetails,
} from "./userreducer";
import Loader from "./Loader";
import Logout from './components/Logout';

var mqtt = require("mqtt");
/*var options = {
  protocol: 'mqtts',
  rejectUnauthorized: false,
}*/

var client = mqtt.connect("mqtt://3.9.173.112:8888");
//var client = mqtt.connect("mqtt://test.mosquitto.org:8081", options);

var fnv = require('fnv-plus');

function generateSubscription(topic) {

  const x_limit = 1000;
  const y_limit = 1000;
  const radius = 1;

  fnv.seed('knock knock');
  var x_hash = fnv.hash(topic);

  fnv.seed('whos there?')
  var y_hash = fnv.hash(topic);

  var x = x_hash.value % x_limit;
  var y = y_hash.value % y_limit;

  var spatialSub = {x: x, y: y, radius: radius, channel: topic}
  return 'sp: <' + JSON.stringify(spatialSub) + '>';
}

function Chat() {
	const [userData, setUserData] = useState([]);
	const userInfo = useAppSelector(selectUserDetails);
	const [haveData, setHaveData] = useState(false);
	const [fetchData, setFetchData] = useState(true);
	const [fetchConnectionData, setFetchConnectionData] = useState(true);
	const input = useRef(null);
	const [partnerPopup, setPartnerPopup] = useState(true);
	const dispatch = useAppDispatch();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [currentState, setCurrentState] = useState({
		name: "",
		profileUrl: "",
		currentChannelName: "",
	});
	const [logout, setLogout] = useState(false);
	const [currentSubto, setCurrentSubto] = useState([]);
	const [addPartnerLoader, setAddPartnerLoader] = useState({
		id: "",
		state: "",
	});

  //const options = {
  //  clientID: userInfo.id,
  //  protocol: 'mqtts',
  //  rejectUnauthorized: false,
	//}

  //var client = mqtt.connect("wss://3.9.173.112:8888");
  //const client = mqtt.connect("mqtt://test.mosquitto.org:8081", options);


  const sendMessage = async () => {
		const topic = generateSubscription(currentState.currentChannelName);
		const payload = JSON.stringify({message: message, userId: userInfo.id});
/*		await client.publish(
			currentState.currentChannelName,
			message + userInfo.id
		);*/
		//console.log(`publishing message ${payload} to topic ${topic}`);
    await client.publish(
          topic,
          payload
		);
		setMessage("");
	};
	const logoutCallback = () => {
		setLogout(true);
	};
	const removeSubscription = async (chatid, second) => {
		try {
			var q = query(
				collection(db, "users"),
				where("userId", "==", userInfo.id ? userInfo.id : "")
			);
			var querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (docdetails) => {
				const userRef = await doc(db, "users", docdetails.id);
				var temp = docdetails.data().subscribed;
				var temp2 = [];
				for (var i = 0; i < temp.length; i++) {
					if (temp[i].scid !== chatid) {
						temp2.push(temp[i]);
					}
				}
				await updateDoc(userRef, {
					subscribed: temp2,
				})
					.then(async () => {
						var q1 = query(
							collection(db, "users"),
							where("userId", "==", second ? second : "")
						);
						var querySnapshot1 = await getDocs(q1);
						querySnapshot1.forEach(async (docdetails1) => {
							const userRef1 = await doc(db, "users", docdetails1.id);
							var temp = docdetails1.data().subscribed;
							var temp3 = [];
							for (var i = 0; i < temp.length; i++) {
								if (temp[i].scid !== chatid) {
									temp3.push(temp[i]);
								}
							}
							updateDoc(userRef1, {
								subscribed: temp3,
							})
								.then(async () => {
									dispatch(
										addUserDetails({
											id: docdetails.data()?.userId,
											email: docdetails.data()?.userEmail[0],
											name: docdetails.data()?.userName[0],
											imageUrl: docdetails.data()?.imageUrl,
											subscribed: temp2,
										})
									);

									setCurrentSubto((prevState) => {
										var info = temp2;
										var sub = [];
										if (!info) info = [];
										for (var i = 0; i < info.length; i++) {
											sub.push(info[i].suid);
										}
										sub.push(userInfo.id);

										return sub;
									});
								})
								.catch((error) => {
									console.error("Error updating document: ", error);
								});
						});
					})

					.catch((error) => {
						console.error("Error updating document: ", error);
					});
			});
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	};
	const addSubscriber = async (id) => {
		try {
			const toinsert = userInfo.id + id;
			var q = query(
				collection(db, "users"),
				where("userId", "==", userInfo.id ? userInfo.id : "")
			);
			var querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (docdetails) => {
				const userRef = await doc(db, "users", docdetails.id);
				var temp = docdetails.data().subscribed;
				if (!temp) temp = [];
				temp.push({
					scid: toinsert,
					suid: id,
				});
				updateDoc(userRef, {
					subscribed: temp,
				})
					.then(async () => {
						var temp = "spat";
						q = query(
							collection(db, "users"),
							where("userId", "==", id ? id : temp)
						);
						querySnapshot = await getDocs(q);
						querySnapshot.forEach(async (docdetails) => {
							const userRef = await doc(db, "users", docdetails.id);
							var temp = docdetails.data().subscribed;
							if (!temp) temp = [];
							temp.push({
								scid: toinsert,
								suid: userInfo.id,
							});
							updateDoc(userRef, {
								subscribed: temp,
							})
								.then(() => {
									setFetchData(true);
								})
								.catch((error) => {
									console.error("Error updating document: ", error);
								});
						});
						setUserData((prev) => {
							var data = [];
							for (var i = 0; i < prev.length; i++) {
								if (prev[i].userId !== id) {
									data.push(prev[i]);
								}
							}
							return data;
						});
						setAddPartnerLoader({
							...addPartnerLoader,
							id: "",
							state: false,
						});
					})
					.catch((error) => {
						console.error("Error updating document: ", error);
					});
			});
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	};
	const getUserList = async () => {
		if (currentSubto.length === 0) {
			var info = userInfo.subscribed;
			var sub = [];
			if (!info) info = [];
			for (var i = 0; i < info.length; i++) {
				sub.push(info[i].suid);
			}
			sub.push(userInfo.id);
		} else {
			sub = currentSubto;
		}
		const q = query(collection(db, "users"));
		var temp2 = [];
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			var temp = doc.data();
			if (!sub.includes(temp.userId)) {
				temp2.push(temp);
			}
		});
		setFetchData(true);
		setUserData(temp2);
		if (temp2.length === 0) {
			setPartnerPopup(false);
		}

	};
	const getConnectionInfo = async () => {
		var info = userInfo.subscribed;

		const q = await query(collection(db, "users"));

		const querySnapshot = await getDocs(q);
		var sideusers = [];
		querySnapshot?.forEach(async (docdetails) => {
			var data = docdetails.data();
			for (var i = 0; i < info?.length; i++) {
				if (info[i].suid === data.userId) {
					data.scid = info[i].scid;
					sideusers.push(data);
					break;
				}
			}
		});

		setAllUsers(sideusers);
		setHaveData(true);
		setFetchConnectionData(false);
	};
	const getUserInfo = async () => {
		try {
			const q = query(
				collection(db, "users"),
				where("userId", "==", userInfo.id)
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
				setFetchData(false);
				setFetchConnectionData(true);
        //console.log(`userInfo.username ${userInfo.name}`)
			});
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		client.on("message", (topic, message) => {
			//console.log(`client.on("message") => Receiving message with topic ${topic} and message ${message}`);
			var startIndex = topic.indexOf('<');
      var stopIndex = topic.indexOf('>');
			//console.log(`JSON topic ${topic.slice(startIndex+1, stopIndex)}`)
			var topicJSON = JSON.parse(topic.slice(startIndex+1, stopIndex));
			var messageJSON = JSON.parse(message);
			var note;
			//note = message.toString();
			//var temp = note.substring(0, note.length - 21);

			var temp = messageJSON.message;
			var userId = messageJSON.userId;

			//console.log(`client.on("message") => temp ${temp} and userId ${userId} and topic ${topicJSON.channel}`);
			//console.log(`client.on("message") => userInfo.id ${userInfo.id}`)
			setMessages((prevState) => {
				var data = prevState;
				if (userId === userInfo.id)
          data.push({ message: temp, isSelf: true });
				else
          data.push({ message: temp, isSelf: false });

				/*if (note.substring(note.length - 21) === userInfo.id)
					data.push({ message: temp, isSelf: true });
				else data.push({ message: temp, isSelf: false });
				*/
				return data;
			});
			var data = [];
      //console.log(`client.on("message") => userInfo.chat[topicJSON.channel] ${userInfo.chat[topicJSON.channel]}`)
      if (userInfo.chat[topicJSON.channel]) {
				for (var i = 0; i < userInfo.chat[topicJSON.channel].length; i++) {
					data.push({
						message: userInfo.chat[topicJSON.channel][i].message,
						isSelf: userInfo.chat[topicJSON.channel][i].isSelf,
					});
				}
			}
      if (userId === userInfo.id)
        data.push({ message: temp, isSelf: true });
      else
        data.push({ message: temp, isSelf: false });

/*			if (note.substring(note.length - 21) === userInfo.id) {
				data.push({ message: temp, isSelf: true });
			} else {
				data.push({ message: temp, isSelf: false });
			}*/
			dispatch(
				addChatDetails({
					id: topicJSON.channel,
					chat: data,
				})
			);
			setMessage(" ");
			setMessage("");
		});
	}, [userInfo, dispatch]);

	useEffect(() => {
		if ((!isSubscribed && userInfo.subscribed) || fetchConnectionData) {
			setIsSubscribed(true);
			var info = userInfo.subscribed;
      var tosub = [];

      if (info) {
				for (var i = 0; i < info.length; i++) {
          //tosub.push(info[i].scid);
					//console.log(`client should subscribe to ${info[i].scid}`);
					const topic = generateSubscription(info[i].scid);
          //console.log(`client ${userInfo.id} is subscribing to topic ${topic}`);
          tosub.push(topic);
          //tosub.push(topic);
				}
				client.subscribe(tosub);
      }



		}
	}, [setIsSubscribed, isSubscribed, userInfo, fetchConnectionData]);

	useEffect(() => {
		if (input && input.current && input.current.scrollTop)
			input.current.scrollTop = input.current.scrollHeight;
	}, [messages.length, message]);

	useEffect(() => {
		try {
			if (fetchConnectionData) getConnectionInfo();
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	}, [fetchConnectionData]);

	useEffect(() => {
		if (fetchData) {
			getUserInfo();
		}
	}, [fetchData]);

	useEffect(() => {
		if (userInfo.chat[currentState.currentChannelName]) {
			var temp = [];
			for (
				var i = 0;
				i < userInfo.chat[currentState.currentChannelName].length;
				i++
			) {
				temp.push({
					message: userInfo.chat[currentState.currentChannelName][i].message,
					isSelf: userInfo.chat[currentState.currentChannelName][i].isSelf,
				});
			}
			setMessages(temp);
		} else setMessages([]);
	}, [currentState.currentChannelName, userInfo.chat]);

	useEffect(() => {
		if (!haveData) {
			getUserList();
			setHaveData(true);
		}
	}, [haveData, setHaveData, userInfo.subscribed]);
	useEffect(() => {
		setFetchData(true);
		setHaveData(false);
	}, [currentSubto]);
	const [isMenuClosed, setIsMenuClosed] = useState(true);
	return (
		<div className="main">
			<div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
				<div className="main-left-avtar">
					<div className="main-left-avtar-logo">{userInfo.name}</div>
					<img
						className="main-left-avtar-element"
						src={userInfo.imageUrl}
						alt=""
					/>
          <div className="Logout">
            <Logout parentCallback={logoutCallback}/>
            <br />
          </div>
				</div>
				<div className="main-left">
					<div className="main-left-users">
						{allUsers.map((element, index) => {
							return (
								<div
									key={index}
									onClick={() => {
										for (var i = 0; i < userInfo.subscribed.length; i++) {
											if (userInfo.subscribed[i].suid === element.userId) {
												setCurrentState({
													...currentState,
													name: element.userName,
													profileUrl: element.imageUrl,
													currentChannelName: userInfo.subscribed[i].scid,
												});
											}
										}
									}}
									className="main-left-users-element"
								>
									<div className="main-left-users-element-avtar">
										<img
											className="main-left-users-element-avtar-img"
											src={element.imageUrl}
											alt=""
										/>
									</div>
									<div className="main-left-users-element-details">
										<div className="main-left-users-element-details-name">
											{element.userName}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<div className="main-right">
				{currentState.name ? (
					<>
						<div className="main-right-top">
							<div className="main-right-top-avtar">
								<img
									className="main-right-top-avtar-img"
									src={currentState.profileUrl}
									alt=""
								/>
							</div>
							<div className="main-right-top-name">{currentState.name}</div>
							<div
								className="main-right-top-functions"
								onClick={() => {
									setIsMenuClosed(!isMenuClosed);
								}}
							>
								<CloseIcon
									onClick={() => {
                    //tosub.push(info[i].scid);
                    const topic = generateSubscription(currentState.currentChannelName);

										client.unsubscribe(topic);
										for (var i = 0; i < userInfo.subscribed.length; i++) {
											if (
												userInfo.subscribed[i].scid ===
												currentState.currentChannelName
											) {
												removeSubscription(
													currentState.currentChannelName,
													userInfo.subscribed[i].suid
												);
												break;
											}
										}

										setCurrentState({
											name: "",
											profileUrl: "",
											currentChannelName: "",
										});
									}}
								/>
							</div>
						</div>
						<div className="main-right-chat" ref={input}>
							{messages ? (
								messages.map(function (message, index) {
									return (
										<div
											className={
												message.isSelf
													? "main-right-chat-self"
													: "main-right-chat-other"
											}
											key={index}
										>
											{message.message}
										</div>
									);
								})
							) : (
								<div>no messages</div>
							)}
						</div>
						<div className="main-right-input">
							<div className="main-right-input-avtar">
								<img
									className="main-right-input-avtar-img"
									src={userInfo.imageUrl}
									alt=""
								/>
							</div>
							<div className="main-right-input-element">
								<input
									type="text"
									onChange={(e) => {
										setMessage(e.target.value);
									}}
									value={message}
									className="main-right-input-element-input"
								/>
							</div>
							<div className="main-right-input-button" onClick={sendMessage}>
								<SendMessageIcon />
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
			{partnerPopup ? (
				<div className="Dropshadow">
					<div className="AddPartner">
						<div
							onClick={() => {
								setPartnerPopup(false);
							}}
							className="AddPartner-cross"
						>
							+
						</div>
						<>
							{userData.map((element, index) => {
								return (
									<div key={index} className="AddPartner-element">
										<div className="AddPartner-element-avtar">
											<img
												className="AddPartner-element-avtar-img"
												src={element.imageUrl}
												alt=""
											/>
										</div>
										<div className="AddPartner-element-details">
											<div className="AddPartner-element-details-name">
												{element.userName}
											</div>
										</div>
										{addPartnerLoader.state &&
										addPartnerLoader.id === element.userId ? (
											<Loader />
										) : (
											<div
												className="AddPartner-element-action"
												onClick={() => {
													setAddPartnerLoader({
														...addPartnerLoader,
														id: element.userId,
														state: true,
													});
													addSubscriber(element.userId);
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="AddPartner-element-action-icon"
													viewBox="0 0 50 50"
												>
													<path d="M 34.21875 4.125 C 33.199219 4.183594 32.195313 4.433594 31.25 4.90625 L 25.75 7.59375 L 10.125 7.59375 L 1.25 5.4375 C 1.117188 5.398438 0.980469 5.390625 0.84375 5.40625 C 0.359375 5.464844 -0.0078125 5.863281 -0.03125 6.351563 C -0.0546875 6.835938 0.273438 7.269531 0.75 7.375 L 9.75 9.5625 L 9.875 9.59375 L 21.65625 9.59375 L 13.15625 13.75 C 13.121094 13.765625 13.097656 13.796875 13.0625 13.8125 C 11.742188 14.394531 11.394531 16.199219 12.375 17.25 L 12.34375 17.28125 C 12.359375 17.296875 12.390625 17.296875 12.40625 17.3125 C 15.382813 20.574219 20.097656 21.65625 24.25 20.03125 L 24.28125 20.03125 L 30.15625 17.75 L 42.28125 29.90625 C 43.199219 30.824219 43.199219 32.269531 42.28125 33.1875 C 41.363281 34.105469 39.917969 34.105469 39 33.1875 C 38.601563 32.867188 38.027344 32.898438 37.664063 33.257813 C 37.304688 33.621094 37.273438 34.195313 37.59375 34.59375 C 38.511719 35.511719 38.511719 36.988281 37.59375 37.90625 C 36.675781 38.824219 35.230469 38.824219 34.3125 37.90625 L 33.59375 37.1875 C 33.195313 36.867188 32.621094 36.898438 32.257813 37.257813 C 31.898438 37.621094 31.867188 38.195313 32.1875 38.59375 C 33.105469 39.511719 33.105469 40.988281 32.1875 41.90625 C 31.269531 42.824219 29.824219 42.824219 28.90625 41.90625 L 28.21875 41.1875 C 27.832031 40.789063 27.195313 40.785156 26.796875 41.171875 C 26.398438 41.558594 26.394531 42.195313 26.78125 42.59375 C 27.699219 43.511719 27.699219 44.988281 26.78125 45.90625 C 25.863281 46.824219 24.417969 46.824219 23.5 45.90625 L 22.25 44.65625 L 23 43.90625 C 24.464844 42.441406 24.464844 40.058594 23 38.59375 C 22.269531 37.863281 21.304688 37.5 20.34375 37.5 C 20.332031 37.5 20.324219 37.5 20.3125 37.5 C 20.328125 36.515625 19.964844 35.527344 19.21875 34.78125 C 18.488281 34.050781 17.523438 33.6875 16.5625 33.6875 C 16.511719 33.6875 16.457031 33.683594 16.40625 33.6875 C 16.4375 32.683594 16.078125 31.671875 15.3125 30.90625 C 14.582031 30.175781 13.617188 29.78125 12.65625 29.78125 C 12.605469 29.78125 12.550781 29.777344 12.5 29.78125 C 12.53125 28.777344 12.171875 27.765625 11.40625 27 C 10.675781 26.269531 9.710938 25.90625 8.75 25.90625 C 7.789063 25.90625 6.824219 26.269531 6.09375 27 L 5.1875 27.90625 L 1.15625 27.21875 C 1.09375 27.203125 1.03125 27.191406 0.96875 27.1875 C 0.417969 27.152344 -0.0585938 27.574219 -0.09375 28.125 C -0.128906 28.675781 0.292969 29.152344 0.84375 29.1875 L 4.125 29.78125 C 3.828125 31.011719 4.136719 32.355469 5.09375 33.3125 C 5.867188 34.085938 6.894531 34.449219 7.90625 34.40625 C 7.863281 35.417969 8.226563 36.445313 9 37.21875 C 9.773438 37.992188 10.800781 38.355469 11.8125 38.3125 C 11.78125 39.316406 12.140625 40.328125 12.90625 41.09375 C 13.652344 41.839844 14.640625 42.203125 15.625 42.1875 C 15.601563 43.175781 15.953125 44.171875 16.6875 44.90625 L 16.71875 44.9375 C 17.761719 45.957031 19.261719 46.226563 20.5625 45.78125 L 22.09375 47.3125 C 23.773438 48.992188 26.539063 48.992188 28.21875 47.3125 C 29.035156 46.496094 29.414063 45.417969 29.4375 44.34375 C 30.882813 44.726563 32.46875 44.4375 33.59375 43.3125 C 34.410156 42.496094 34.820313 41.417969 34.84375 40.34375 C 36.285156 40.722656 37.875 40.4375 39 39.3125 C 39.960938 38.351563 40.324219 37.042969 40.1875 35.78125 C 41.449219 35.921875 42.757813 35.554688 43.71875 34.59375 C 44.792969 33.519531 45.175781 32.011719 44.875 30.625 L 45.46875 30.03125 L 49.15625 29.5 C 49.707031 29.414063 50.085938 28.894531 50 28.34375 C 49.914063 27.792969 49.394531 27.414063 48.84375 27.5 L 44.84375 28.125 L 44.53125 28.15625 L 43.9375 28.75 C 43.867188 28.667969 43.796875 28.578125 43.71875 28.5 L 31.40625 16.1875 C 31.359375 16.140625 31.304688 16.097656 31.25 16.0625 C 31.238281 16.050781 31.230469 16.042969 31.21875 16.03125 C 30.957031 15.644531 30.464844 15.492188 30.03125 15.65625 L 23.53125 18.15625 C 20.113281 19.507813 16.265625 18.628906 13.84375 15.9375 L 13.8125 15.90625 C 13.683594 15.777344 13.675781 15.6875 13.84375 15.625 L 13.90625 15.625 L 13.9375 15.59375 L 26.28125 9.5625 C 26.492188 9.53125 26.691406 9.433594 26.84375 9.28125 L 32.125 6.6875 L 32.15625 6.6875 C 34 5.765625 36.152344 5.953125 37.84375 7.09375 L 38.21875 7.53125 L 38.3125 7.65625 L 38.4375 7.71875 C 40.253906 8.96875 42.441406 9.300781 44.5 8.75 L 44.5 8.78125 L 44.5625 8.75 L 49.21875 7.78125 C 49.761719 7.660156 50.105469 7.121094 49.984375 6.578125 C 49.863281 6.035156 49.324219 5.691406 48.78125 5.8125 L 44.09375 6.8125 L 44.0625 6.84375 L 44.03125 6.84375 C 42.539063 7.257813 41 6.984375 39.65625 6.09375 L 39.28125 5.65625 L 39.1875 5.5625 L 39.0625 5.46875 C 37.914063 4.664063 36.601563 4.226563 35.25 4.125 C 34.910156 4.101563 34.558594 4.105469 34.21875 4.125 Z M 8.75 27.84375 C 9.1875 27.84375 9.632813 28.039063 10 28.40625 C 10.734375 29.140625 10.734375 30.171875 10 30.90625 L 9.21875 31.65625 L 9.125 31.75 L 9 31.90625 C 8.265625 32.640625 7.234375 32.640625 6.5 31.90625 C 5.898438 31.304688 5.808594 30.515625 6.1875 29.84375 C 6.363281 29.71875 6.492188 29.546875 6.5625 29.34375 L 7.375 28.5625 L 7.5 28.40625 C 7.867188 28.039063 8.3125 27.84375 8.75 27.84375 Z M 12.65625 31.75 C 13.09375 31.75 13.539063 31.945313 13.90625 32.3125 C 14.640625 33.046875 14.640625 34.046875 13.90625 34.78125 L 12.90625 35.78125 C 12.171875 36.515625 11.140625 36.515625 10.40625 35.78125 C 9.671875 35.046875 9.671875 34.046875 10.40625 33.3125 L 11.40625 32.3125 C 11.773438 31.945313 12.21875 31.75 12.65625 31.75 Z M 16.5625 35.65625 C 17 35.65625 17.414063 35.851563 17.78125 36.21875 C 18.386719 36.824219 18.488281 37.613281 18.09375 38.28125 C 17.957031 38.382813 17.8125 38.46875 17.6875 38.59375 L 16.6875 39.59375 L 16.6875 39.625 L 16.65625 39.625 C 16.546875 39.746094 16.464844 39.871094 16.375 40 C 15.707031 40.394531 14.917969 40.292969 14.3125 39.6875 C 13.578125 38.953125 13.578125 37.953125 14.3125 37.21875 L 15.0625 36.4375 L 15.25 36.28125 L 15.3125 36.21875 C 15.679688 35.851563 16.125 35.65625 16.5625 35.65625 Z M 20.34375 39.46875 C 20.78125 39.46875 21.226563 39.632813 21.59375 40 C 22.328125 40.734375 22.328125 41.765625 21.59375 42.5 L 20.59375 43.5 C 20.507813 43.585938 20.4375 43.683594 20.34375 43.75 C 20.335938 43.753906 20.320313 43.746094 20.3125 43.75 C 19.613281 44.234375 18.738281 44.144531 18.09375 43.5 C 17.621094 43.027344 17.511719 42.082031 17.84375 41.375 C 17.96875 41.277344 18.105469 41.207031 18.21875 41.09375 L 19.21875 40.09375 C 19.351563 39.960938 19.453125 39.804688 19.5625 39.65625 C 19.8125 39.53125 20.082031 39.46875 20.34375 39.46875 Z"></path>
												</svg>
											</div>
										)}
									</div>
								);
							})}
							{!haveData && (
								<h1 style={{ width: "100%", textAlign: "center" }}>
									<Loader />
								</h1>
							)}
						</>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						setPartnerPopup(true);
					}}
					style={{
						cursor: "pointer",
						position: "absolute",
						right: "1rem",
						top: "5rem",
						fontSize: "2rem",
						color: "black",
						width: "2.5rem",
						height: "2.5rem",
						lineHeight: "1rem",
						borderRadius: "5px",
						backgroundColor: "white",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{" "}
					+{" "}
				</div>
			)}
			{logout && <Navigate to="/" />}
		</div>
	);
}

export default Chat;
