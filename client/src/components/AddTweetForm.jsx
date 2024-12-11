// import { useState } from "react";
// import Successmsg from "./Common/Successmsg";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { handleApiError } from "../utils/errorHandler";
// import { toast, ToastContainer } from "react-toastify";

// function AddTweetForm() {
//   const [formData, setFormData] = useState({
//     content: "",
//   });
//   const [added, setAdded] = useState(null);
//   const [error, setError] = useState(null);
//   const [successAlert, setSuccessAlert] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [postData, setPostData] = useState(null);
//   const userObject = useSelector((state) => state.user.userData);
//   const { loggedInUser: user } = userObject || {};

//   const notify = (text) => toast(text);

//   const onchange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onsubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       if (!editing) {
//         const response = await axios.post(
//           "http://localhost:8000/api/v1/tweets/create-Tweet",
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const { data } = response?.data || {};
//         const { tweet } = data || {};

//         setPostData(tweet);

//         setAdded(formData.content);
//         setFormData({ content: "" });
//         setSuccessAlert(true);
//       } else {
//         const id = postData?._id;
//         const response = await axios.patch(
//           `http://localhost:8000/api/v1/tweets/${id}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const { data } = response?.data || {};
//         setPostData(data);
//         setAdded(formData.content);
//         setFormData({ content: "" });
//         setSuccessAlert(true);
//         notify("Tweet added Successfully!!");
//         setEditing(false);
//       }
//     } catch (error) {
//       handleApiError(error, setError);
//     }
//   };

//   const onClickEdit = () => {
//     setSuccessAlert(false);
//     setFormData({ content: added });
//     setAdded(null);
//     setEditing(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col justify-center items-center w-full h-fit ">
//         <div className="mb-12 shadow-lg w-2/5 h-2/3 p-5 bg-gray-800 rounded-lg text-white ">
//           {successAlert && <Successmsg text="Tweet added Successfully!!" />}
//           <ToastContainer />
//           <h2 className="text-center text-2xl/9 font-bold text-white my-3">
//             What's on your mind
//           </h2>
//           {error && <p className="text-red-500 text-center ">{error}</p>}
//           <form
//             onSubmit={onsubmit}
//             className="w-3/4 flex flex-col items-center mx-auto space-y-3 "
//           >
//             {user && (
//               <div className="flex mt-5 self-start">
//                 <img
//                   src={user.avatar}
//                   alt={user.fullName}
//                   className="w-8 h-8 rounded-full mr-3 "
//                 />
//                 <span className="self-center">{user.fullName}</span>
//               </div>
//             )}

//             {added ? (
//               <div className="w-full">
//                 <div className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-500 dark:hover:bg-gray-700">
//                   <div className="font-normal text-wrap text-gray-700 dark:text-gray-200 h-28 max-h-28 max-w-sm overflow-scroll no-scrollbar">
//                     {added}
//                   </div>
//                 </div>
//                 <div className="input-group flex flex-col w-full items-center">
//                   <button
//                     onClick={onClickEdit}
//                     type="submit"
//                     className="mt-4 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="input-group flex flex-col w-full ">
//                   <textarea
//                     placeholder="Content"
//                     name="content"
//                     value={formData.content}
//                     onChange={onchange}
//                     required
//                     className="block w-full text-wrap h-28 max-h-28 rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
//                   />
//                 </div>

//                 <div className="input-group flex flex-col w-full items-center">
//                   <button
//                     type="submit"
//                     className="mt-4 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                   >
//                     Post
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AddTweetForm;

// /*
// ChatGPT

import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";
import { toast, ToastContainer } from "react-toastify";

function AddTweetForm({}) {
  const [formData, setFormData] = useState({ content: "" });
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const user = useSelector((state) => state.user?.userData?.loggedInUser);

  const notify = (text) => toast(text);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = editing
      ? `http://localhost:8000/api/v1/tweets/${postData?._id}`
      : "http://localhost:8000/api/v1/tweets/create-Tweet";
    const method = editing ? "patch" : "post";

    try {
      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { data } = response?.data || {};
      setPostData(editing ? data : data?.tweet);
      setFormData({ content: "" });

      if (editing) {
        notify("Tweet updated successfully!");
      } else {
        notify("Tweet added successfully!");
      }

      setEditing(false);
    } catch (err) {
      handleApiError(err, setError);
    }
  };

  const handleEdit = () => {
    setFormData({ content: postData?.content });
    setEditing(true);
    
  };

  const handleDelete = async () => {
    
    const deleteTweet = await axios.delete(`http://localhost:8000/api/v1/tweets/${postData?._id}`)
    
    if (deleteTweet) {
      setFormData({ content: "" })
      setEditing(false);
      setPostData(null)
      confirm("Are you sure you want to delete this tweet?")
      notify("Tweet deleted successfully")
    }

  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-fit">
      <div className="mb-12 shadow-lg w-2/5 h-2/3 p-5 bg-gray-800 rounded-lg text-white">
        <ToastContainer />

        <h2 className="text-center text-2xl font-bold my-3">What's on your mind?</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center mx-auto space-y-3">
          {user && (
            <div className="flex mt-5 self-start">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="self-center">{user.fullName}</span>
            </div>
          )}

          {postData && !editing ? (
            <div className="w-full flex flex-col items-center">
              <div className="block w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-500">
                <div className="font-normal text-gray-700 dark:text-gray-200 h-28 overflow-scroll no-scrollbar">
                  {postData.content}
                </div>
              </div>
              <div className="flex space-x-5">

              
              <button
                onClick={handleEdit}
                type="button"
                className="mt-4 w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-indigo-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                type="button"
                className="mt-4 w-fit rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline focus:outline-red-600"
              >
                Delete
              </button>
              </div>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="block w-full text-wrap h-28 max-h-28 rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
              />
              <button
                type="submit"
                className="mt-4 w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-indigo-600"
              >
                {editing ? "Update" : "Post"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddTweetForm;



// */