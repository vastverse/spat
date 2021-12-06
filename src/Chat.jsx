import { current } from "@reduxjs/toolkit";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { db } from "./firebaseconnector";
import { useAppDispatch, useAppSelector } from "./Hooks";

import { CloseIcon, MenuIcon, SendMessageIcon } from "./icons";
import { addUserDetails, selectUserDetails } from "./userreducer";

var mqtt = require("mqtt");
var client = mqtt.connect("ws://test.mosquitto.org:8080");
var mytopic = "amit";
function Chat() {
	const input = useRef(null);
	const userInfo = useAppSelector(selectUserDetails);

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

	// const handleCallback = useCallback(
	// 	(topic, message) => {
	// 		var note;
	// 		note = message.toString();
	// 		console.log("note is ", note, topic);
	// 		setMessages((prevState) => {
	// 			var data = prevState;
	// 			if (topic === mytopic) data.push({ message: note, isSelf: true });
	// 			else data.push({ message: note, isSelf: false });
	// 			return data;
	// 		});
	// 		setMessage(" ");
	// 		setMessage("");
	// 	},
	// 	[setMessages, setMessage]
	// );

	const addSubscriber = async () => {
		try {
			console.log(userInfo);
			const q = query(
				collection(db, "users"),
				where("userId", "==", userInfo.id ? userInfo.id : "amit")
			);
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (docdetails) => {
				const userRef = await doc(db, "users", docdetails.id);
				updateDoc(userRef, {
					subscribed: ["amit", "amit2"],
				})
					.then(() => {
						console.log("Document successfully updated!");
					})
					.catch((error) => {
						console.error("Error updating document: ", error);
					});
			});
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	};

	const sendMessage = async () => {
		await client.publish(currentState.currentChannelName, message);
		setMessage("");
	};

	const getConnectionInfo = async () => {
		var info = userInfo.subscribed;
		var tosub = [];
		for (var i = 0; i < info.length; i++) {
			tosub.push(info[i].suid);
		}

		const q = await query(
			collection(db, "users"),
			where("userId", "in", tosub)
		);

		const querySnapshot = await getDocs(q);
		var sideusers = [];
		querySnapshot?.forEach(async (docdetails) => {
			sideusers.push(docdetails.data());
		});

		setAllUsers(sideusers);
	};

	useEffect(() => {
		client.on("message", (topic, message) => {
			var note;
			note = message.toString();
			console.log("note is ", note, topic);
			setMessages((prevState) => {
				var data = prevState;
				if (topic === mytopic) data.push({ message: note, isSelf: true });
				else data.push({ message: note, isSelf: false });
				return data;
			});
			setMessage(" ");
			setMessage("");
		});
	}, []);

	useEffect(() => {
		if (!isSubscribed) {
			setIsSubscribed(true);
			var info = userInfo.subscribed;
			var tosub = [];
			for (var i = 0; i < info.length; i++) {
				tosub.push(info[i].scid);
			}
			client.subscribe(tosub);
		}
	}, [setIsSubscribed, isSubscribed, userInfo]);

	useEffect(() => {
		if (input && input.current && input.current.scrollTop)
			input.current.scrollTop = input.current.scrollHeight;
	}, [messages.length, message]);

	useEffect(() => {
		try {
			getConnectionInfo();
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	});

	const [isMenuClosed, setIsMenuClosed] = useState(true);
	return (
		<div className="main">
			<div className="main-left">
				<div className="main-left-avtar">
					<div className="main-left-avtar-logo">Spat</div>
					<img
						className="main-left-avtar-element"
						src={userInfo.imageUrl}
						alt=""
					/>
				</div>
				<div className="main-left-users">
					{allUsers.map((element, index) => {
						return (
							<div
								key={index}
								onClick={() => {
									console.log(allUsers);
									if (element.userId < userInfo.id) {
										setCurrentState({
											...currentState,
											name: element.userName,
											profileUrl: element.imageUrl,
											currentChannelName: element.userId + userInfo.id,
										});
										console.log(element.userId + userInfo.id);
									} else {
										setCurrentState({
											...currentState,
											name: element.userName,
											profileUrl: element.imageUrl,
											currentChannelName: userInfo.id + element.userId,
										});
										console.log(userInfo.id + element.userId);
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
								{isMenuClosed ? <MenuIcon /> : <CloseIcon />}
							</div>
						</div>
						<div className="main-right-chat" ref={input}>
							{messages.map(function (message, index) {
								// console.log(message);
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
							})}
						</div>
						<div className="main-right-input">
							<div className="main-right-input-avtar">
								<img
									onClick={addSubscriber}
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
		</div>
	);
}

export default Chat;

// 0x43ae9b42829ecc9dd601d9a47db72cee690ce55c
