export const CloseIcon = (props) => {
	return (
		<svg
			onClick={props.onClick}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
				fill="black"
				fill-opacity="0.54"
			/>
		</svg>
	);
};

export const MenuIcon = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 8C13.1 8 14 7.10001 14 6C14 4.89999 13.1 4 12 4C10.9 4 10 4.89999 10 6C10 7.10001 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18Z"
				fill="black"
				fill-opacity="0.54"
			/>
		</svg>
	);
};

export const SendIcon = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.79995 15.9L4.59995 11.7L3.19995 13.1L8.79995 18.7L20.8 6.7L19.4 5.3L8.79995 15.9Z"
				fill="black"
				fill-opacity="0.54"
			/>
		</svg>
	);
};

export const RecieveIcon = (isSeen) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M22.2051 5.295L11.625 15.875L7.44507 11.705L6.03503 13.115L11.625 18.705L23.625 6.705L22.2051 5.295ZM17.965 6.705L16.5549 5.295L10.215 11.635L11.625 13.045L17.965 6.705ZM5.96497 18.705L0.375 13.115L1.79504 11.705L7.375 17.295L5.96497 18.705Z"
				fill={isSeen ? "black" : "green"}
				fill-opacity="0.54"
			/>
		</svg>
	);
};

export const SendMessageIcon = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6.16504 20.13L7.93504 21.9L17.835 12L7.93504 2.10001L6.16504 3.87001L14.295 12L6.16504 20.13H6.16504Z"
				fill="white"
			/>
		</svg>
	);
};
