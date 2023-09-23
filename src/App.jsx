import { useState, useEffect } from "react";
import "./App.css";
import Play from "../components/play";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { FiSend } from "react-icons/fi";
import { MdOutlineEmojiEmotions } from "react-icons/md";

const ws = new WebSocket(
	`wss:${import.meta.env.VITE_API_URL}/cable`,
	"echo-protocol"
);

import AOS from "aos";
import "aos/dist/aos.css";

const Avatar1 = "/avatar/avatar1-removebg-preview.png";
const Avatar2 = "/avatar/avatar2-removebg-preview.png";
const Avatar3 = "/avatar/avatar3-removebg-preview.png";
const Avatar4 = "/avatar/avatar4-removebg-preview.png";
const Avatar5 = "/avatar/avatar5-removebg-preview.png";
const Avatar6 = "/avatar/avatar6-removebg-preview.png";
const Avatar7 = "/avatar/avatar7-removebg-preview.png";
const Avatar8 = "/avatar/avatar8-removebg-preview.png";
const Avatar9 = "/avatar/avatar9-removebg-preview.png";

function App() {
	const [game, setGame] = useState("setUsername");
	const [error, setError] = useState("");
	const [dataUser, setDataUser] = useState({
		username: "",
		avatar: "",
	});
	const [showEmojiDiv, setShowEmojiDiv] = useState(false);
	const [inputStr, setInputStr] = useState("");

	useEffect(() => {
		AOS.init();
	}, []);
	// useEffect(() => {
	// 	console.log(import.meta.env.VITE_API_URL); // 123
	// }, []);
	const [messages, setMessages] = useState([]);
	const [guid, setGuid] = useState("");
	const messagesContainerRef = document.getElementById("messagesContainer");

	ws.onopen = () => {
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
		resetScroll();
	}, []);

	useEffect(() => {
		resetScroll();
	}, [messages]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const body = e.target.message.value;
		e.target.message.value = "";
		setInputStr("");
		if (!body) {
			return;
		}
		await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				body,
				sender: dataUser.username,
				avatar: dataUser.avatar,
			}),
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
		if (!messagesContainerRef) return;
		messagesContainerRef.scrollTop = messagesContainerRef.scrollHeight;
	};

	function formatDateToHHMM(dateTimeString) {
		const dateTime = new Date(dateTimeString);

		const hours = dateTime.getUTCHours().toString().padStart(2, "0");
		const minutes = dateTime.getUTCMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	}

	function onClickEmoji(emojiObject) {
		setInputStr((prevInput) => prevInput + emojiObject.emoji);
		setShowEmojiDiv(false);
	}
	const handleClick = (gameState) => {
		setGame(gameState);
	};

	const LoadingDiv = () => (
		<main className="grid bg-slate-800 w-full mx-auto h-screen  place-content-center">
			<div className="w-[25rem] md:w-[30rem] mx-auto bg-slate-50 h-[50rem] flex flex-col justify-between rounded-3xl overflow-hidden">
				<div className="w-full h-full grid place-content-center bg-sky-300">
					<div role="status">
						<svg
							aria-hidden="true"
							className="inline w-10 h-10 mr-2 text-gray-200 animate-spin  fill-blue-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		</main>
	);

	const SetUsernameDiv = (props) => {
		const handleSubmit = async (e) => {
			e.preventDefault();
			const username = e.target.username.value;
			if (!username) {
				setError("Jenengmu ra oleh kosong!");
				return;
			}
			e.target.username.value = "";
			props.setDataUser({ ...props.dataUser, username });
			props.handleClick("loading");
			setTimeout(() => {
				props.handleClick("setAvatar");
			}, 1500);
		};

		return (
			<main className="grid bg-slate-800 w-full mx-auto h-screen  place-content-center">
				<div className="w-[25rem] md:w-[30rem] mx-auto bg-slate-50 h-[50rem] flex flex-col justify-between rounded-3xl overflow-hidden">
					<div className="w-full h-full grid place-content-center bg-sky-300">
						<div data-aos="zoom-in" data-aos-duration="1500">
							<h1 className="text-white text-4xl font-bold mb-3">
								Sopo jenengmu?
							</h1>
							<form
								onSubmit={(e) => {
									handleSubmit(e);
								}}
								className="flex flex-col gap-5 w-full justify-center items-center"
							>
								<input
									type="text"
									name="username"
									className="w-full text-center h-[3rem] border-b bg-sky-300 focus:outline-none text-white text-xl"
									maxLength={10}
								/>
								{error && (
									<div>
										<span className="text-purple-700 text-lg">
											{error}
										</span>
									</div>
								)}
								<button
									type="submit"
									className="w-[10rem] py-3 rounded-lg text-white border border-white"
								>
									Budal
								</button>
							</form>
						</div>
					</div>
				</div>
			</main>
		);
	};
	const SetAvatarDiv = (props) => {
		const handleClick = async (e, item) => {
			e.preventDefault();
			props.setDataUser({ ...props.dataUser, avatar: item });
			props.handleClick("loading");
			setTimeout(() => {
				props.handleClick("start");
			}, 1500);
		};

		const dataAvatar = [
			{
				id: 1,
				avatar: Avatar1,
			},
			{
				id: 2,
				avatar: Avatar2,
			},
			{
				id: 3,
				avatar: Avatar3,
			},
			{
				id: 4,
				avatar: Avatar4,
			},
			{
				id: 5,
				avatar: Avatar5,
			},
			{
				id: 6,
				avatar: Avatar6,
			},
			{
				id: 7,
				avatar: Avatar7,
			},
			{
				id: 8,
				avatar: Avatar8,
			},
			{
				id: 9,
				avatar: Avatar9,
			},
		];
		return (
			<main className="grid bg-slate-800 w-full mx-auto h-screen  place-content-center ">
				<div className="w-[25rem] md:w-[30rem] mx-auto bg-slate-50 h-[50rem] flex flex-col justify-between rounded-3xl overflow-hidden">
					<div className="w-full h-full grid place-content-center bg-sky-300">
						<div data-aos="zoom-in" data-aos-duration="1500">
							<h1 className="text-white text-3xl font-bold text-center mb-5">
								Milih avatarmu :
							</h1>
							<div className="grid grid-cols-12 gap-5">
								{dataAvatar.map((item) => {
									return (
										<div
											key={item.id}
											className="col-span-4 hover:scale-110 transition-all duration-300 cursor-pointer"
											onClick={(e) => {
												handleClick(e, item.id);
											}}
										>
											<img
												src={item.avatar}
												className="w-20"
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	};

	return (
		<div>
			{(() => {
				switch (game) {
					case "setUsername":
						return (
							<SetUsernameDiv
								handleClick={handleClick}
								dataUser={dataUser}
								setDataUser={setDataUser}
							/>
						);
					case "setAvatar":
						return (
							<SetAvatarDiv
								handleClick={handleClick}
								dataUser={dataUser}
								setDataUser={setDataUser}
							/>
						);
					case "start":
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
											item.sender ===
											dataUser.username ? (
												<div
													key={idx}
													className="w-full h-min  flex items-end  gap-0 py-3 pl-4 pr-2 "
												>
													<div className="flex flex-col w-full pr-4 ">
														<div className="bubble right min-w-[200px]">
															<div className="flex justify-between items-center ">
																<p className=" tracking-wider text-slate-800 capitalize">
																	Koe
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
																	{
																		item.sender
																	}
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
													className="w-full py-4 pl-4 pr-20 rounded-b-3xl bg-white focus:outline-none group text-md text-slate-600"
													placeholder="Tulis opo wae..."
													name="message"
													type="text"
													value={inputStr}
													onChange={(e) =>
														setInputStr(
															e.target.value
														)
													}
												/>

												<MdOutlineEmojiEmotions
													className={`text-[1.5rem] text-blue-500 absolute top-1/2 right-12 transform -translate-y-1/2 cursor-pointer`}
													onClick={() => {
														setShowEmojiDiv(
															!showEmojiDiv
														);
													}}
												/>
												<FiSend
													className={`text-[1.5rem] text-blue-500 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer`}
												/>
											</form>
											{showEmojiDiv && (
												<div className="absolute bottom-[3.6rem] right-0">
													<EmojiPicker
														onEmojiClick={
															onClickEmoji
														}
														autoFocusSearch={false}
														emojiStyle={
															EmojiStyle.NATIVE
														}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							</main>
						);
					case "loading":
						return (
							<LoadingDiv
								handleClick={handleClick}
								dataUser={dataUser}
							/>
						);
					default:
						return null;
				}
			})()}
		</div>
	);
}

export default App;
