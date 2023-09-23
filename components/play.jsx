import React, { useCallback } from "react";
import { createRef, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

import "../src/index.css";

import ActionCable from "actioncable";

var ws = ActionCable.createConsumer(
	`wss:${import.meta.env.VITE_API_URL}/cable`
);

// const ws = new WebSocket(
// 	`wss:${import.meta.env.VITE_API_URL}/cable`,
// 	"echo-protocol"
// );

const Play = (props) => {
	const [messages, setMessages] = useState([]);
	const [guid, setGuid] = useState("");
	const messagesContainer = document.getElementById("messagesContainer");

	ws.onopen = () => {
		console.log("Connected to websocket server");
		setGuid(Math.random().toString(36).substring(2, 15));

		ws.send(
			JSON.stringify({
				command: "subscribe",
				identifier: JSON.stringify({
					id: guid,
					channel: "MessagesChannel",
				}),
			})
		);
	};

	ws.onmessage = (e) => {
		const data = JSON.parse(e.data);
		if (data.type === "ping") return;
		if (data.type === "welcome") return;
		if (data.type === "confirm_subscription") return;

		const message = data.message;
		setMessagesAndScrollDown([...messages, message]);
	};

	useEffect(() => {
		fetchMessages();
	}, []);

	useEffect(() => {
		resetScroll();
	}, [messages]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const body = e.target.message.value;
		e.target.message.value = "";

		await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ body }),
		});
	};

	const fetchMessages = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/messages`
		);
		const data = await response.json();
		setMessagesAndScrollDown(data);
	};

	const setMessagesAndScrollDown = (data) => {
		setMessages(data);
		resetScroll();
	};

	const resetScroll = () => {
		if (!messagesContainer) return;
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	};

	function formatDateToHHMM(dateTimeString) {
		const dateTime = new Date(dateTimeString);

		const hours = dateTime.getUTCHours().toString().padStart(2, "0");
		const minutes = dateTime.getUTCMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	}
	return (
		<main className="grid  bg-slate-800 w-full mx-auto h-screen  place-content-center">
			<div
				className="w-[25rem] md:w-[30rem] mx-auto bg-slate-50 h-[50rem] flex flex-col justify-between rounded-3xl overflow-hidden"
				data-aos="zoom-in"
			>
				{/* HEADER */}
				<div className="w-full h-[15%]  flex justify-start items-center px-3 shadow-xl">
					<div>
						<img
							src="https://static.vecteezy.com/system/resources/previews/018/930/718/original/discord-logo-discord-icon-transparent-free-png.png"
							className="w-20"
						/>
					</div>
					<div>
						<h1 className="text-2xl font-semibold text-slate-800">
							Ngendika
						</h1>
						{/* <img src='/img/logo.png' className='w-52' /> */}
						<p className="text-slate-500 tracking-wider text-sm">
							Aplikasi chatting gawean Surya
						</p>
					</div>
				</div>
				{/* CHATROOM */}
				<div
					className="w-full  h-full flex flex-col gap-0 pt-3  overflow-y-scroll bg-slate-100 bg-opacity-90"
					id="messagesContainer"
				>
					{messages.map((item, idx) =>
						item.sender === props.dataUser.username ? (
							<div
								key={idx}
								className="w-full h-min  flex items-end  gap-0 py-3 pl-4 pr-2 "
							>
								<div className="flex flex-col w-full pr-4 ">
									<div className="bubble right min-w-[200px]">
										<div className="flex justify-between items-center ">
											<p className=" tracking-wider text-slate-800 capitalize">
												You
											</p>
											<p className="text-gray-400 text-sm tracking-wider">
												{formatDateToHHMM(
													item.created_at
												)}
											</p>
										</div>
										<p className="py-1  max-w-full text-gray-500 tracking-wider text-xs md:text-sm font-light leading-relaxed">
											{item.body}
										</p>
									</div>
								</div>
								<div className="">
									<img
										src={`/avatar/avatar${item.avatar}-removebg-preview.png`}
										className="w-10 h-10 rounded-full object-cover "
									/>
								</div>
							</div>
						) : (
							<div
								key={idx}
								className="w-full h-min  flex items-end  gap-0 py-3 pl-4 pr-2 "
							>
								<div className="">
									<img
										src={`/avatar/avatar${item.avatar}-removebg-preview.png`}
										className="w-10 h-10 rounded-full object-cover "
									/>
								</div>
								<div className="flex flex-col w-full pr-4 ">
									<div className="bubble left min-w-[200px]">
										<div className="flex justify-between items-center ">
											<p className=" tracking-wider text-slate-800 capitalize">
												{item.sender}
											</p>
											<p className="text-gray-400 text-sm tracking-wider">
												{formatDateToHHMM(
													item.created_at
												)}
											</p>
										</div>
										<p className="py-1  max-w-full text-gray-500 tracking-wider text-xs md:text-sm font-light leading-relaxed">
											{item.body}
										</p>
									</div>
								</div>
							</div>
						)
					)}
				</div>

				{/* TYPE MESSAGE */}
				<div className="w-full h-[15%] bg-slate-100 flex justify-between items-center px-4 shadow-md">
					<div className="flex items-center gap-3 w-full relative mb-1">
						<form
							onSubmit={handleSubmit}
							className="relative w-full"
						>
							<input
								className="w-full py-4 pl-4 pr-12 rounded-b-3xl focus:outline-none group text-md text-slate-600"
								placeholder="Tulis opo wae..."
								name="message"
								type="text"
							/>
							<FiSend
								className={`text-[1.5rem] text-blue-500 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer`}
							/>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Play;
