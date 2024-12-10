
function SubscribeButton({onclick,subscribed}) {

  return (
    <button
      onClick={onclick}
      className={`px-6 py-2 text-sm font-semibold rounded-full transition duration-300
        ${
          subscribed
            ? "bg-transparent border border-solid text-white hover:border-2"
            : "bg-red-500 text-white  hover:border hover:border-solid"
        }`}
    >
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}

export default SubscribeButton;
