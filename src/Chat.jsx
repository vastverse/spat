import React, { useState, useRef, useEffect, useCallback } from "react";

import { CloseIcon, MenuIcon, SendMessageIcon } from "./icons";

var mqtt = require("mqtt");
var client = mqtt.connect("ws://test.mosquitto.org:8080");
var mytopic = "amit";
function Chat() {
	const input = useRef(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const handleCallback = useCallback(
		(topic, message) => {
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
			console.log("amit ");
		},
		[setMessages, setMessage]
	);

	useEffect(() => {
		client.on("message", handleCallback);
	}, [setMessages, handleCallback]);
	useEffect(() => {
		client.subscribe("amit");
	});

	useEffect(() => {
		input.current.scrollTop = input.current.scrollHeight;
	}, [messages.length, message]);

	const sendMessage = async () => {
		await client.publish("amit", message);
		setMessage("");
	};

	const [isMenuClosed, setIsMenuClosed] = useState(true);
	return (
		<div className="main">
			<div className="main-left">
				<div className="main-left-avtar">
					<div className="main-left-avtar-logo">Spat</div>
					<img
						className="main-left-avtar-element"
						src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
						alt=""
					/>
				</div>
				<div className="main-left-users">
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">amit</div>
							<div className="main-left-users-element-details-text">
								hi its amit
							</div>
						</div>
					</div>
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">
								Rajendra
							</div>
							<div className="main-left-users-element-details-text">
								hi this side rajendra
							</div>
						</div>
					</div>
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">mamta</div>
							<div className="main-left-users-element-details-text">hi</div>
						</div>
					</div>
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">mamta</div>
							<div className="main-left-users-element-details-text">hi</div>
						</div>
					</div>
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">saroj</div>
							<div className="main-left-users-element-details-text">hi</div>
						</div>
					</div>
					<div className="main-left-users-element">
						<div className="main-left-users-element-avtar">
							<img
								className="main-left-users-element-avtar-img"
								src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
								alt=""
							/>
						</div>
						<div className="main-left-users-element-details">
							<div className="main-left-users-element-details-name">Kanta</div>
							<div className="main-left-users-element-details-text">hi</div>
						</div>
					</div>
				</div>
			</div>
			<div className="main-right">
				<div className="main-right-top">
					<div className="main-right-top-avtar">
						<img
							className="main-right-top-avtar-img"
							src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
							alt=""
						/>
					</div>
					<div className="main-right-top-name">Kanta</div>
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
					<div className="main-right-chat-self">hi</div>
					<div className="main-right-chat-other">hi</div>
					{messages.map(function (message, index) {
						console.log(message);
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
							className="main-right-input-avtar-img"
							src="https://static.remove.bg/remove-bg-web/e88d40fe6b242c5a4872a70c3c93599d93563581/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
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
			</div>
		</div>
	);
}

export default Chat;
