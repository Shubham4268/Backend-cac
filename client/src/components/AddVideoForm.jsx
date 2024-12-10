import axios from "axios";
import { handleApiError } from "../utils/errorHandler";
import { useState } from "react";
import Successmsg from "./Common/Successmsg";
import { useRef } from "react";

const InputField = ({ type, name, value, onChange, placeholder }) => (
  <div className="input-group flex flex-col w-full">
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="block mt-3 w-full rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  </div>
);


function AddVideoForm() {
    const [successAlert, setSuccessAlert] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState(null);

  // Refs for file inputs
  const videoFileRef = useRef(null);
  const thumbnailRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Create FormData object for the submission
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (videoFileRef.current?.files[0]) {
      data.append("videoFile", videoFileRef.current.files[0]);
    }
    if (thumbnailRef.current?.files[0]) {
      data.append("thumbnail", thumbnailRef.current.files[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/videos/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      // Reset form inputs
      setFormData({
        title: "",
        description: "",
      });
      videoFileRef.current.value = "";
      thumbnailRef.current.value = "";
      setSuccessAlert(true);
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-full ">
        {successAlert && <Successmsg text = "Video uploaded Successfully!!"/>}
        <div className="mt-28 mb-12 shadow-lg w-2/5 h-2/3 p-5 bg-gray-800 rounded-lg text-white ">
        <h2 className="text-center text-2xl/9 font-bold text-white my-6">
            Upload Your Video
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form
            onSubmit={onSubmit}
            className="w-3/4 flex flex-col items-center mx-auto space-y-5 "
          >
            <InputField
              placeholder="Title"
              onChange={onChange}
              name="title"
              value={formData.title}
            />
            <div className="input-group flex flex-col w-full">
              <textarea
                placeholder="Description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                className="block w-full text-wrap max-h-16 rounded-md text-white bg-gray-800 px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
              />
            </div>

            <div className="flex w-full p-1 outline outline-1 -outline-offset-1 outline-gray-300 rounded-md ">
              <label
                className="block w-36 self-center text-sm text-gray-400 "
                htmlFor="video_file_input"
              >
                Upload Video
              </label>
              <input
                ref={videoFileRef}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="video_file_input_help"
                id="video_file_input"
                type="file"
                accept="video/*"
              />
            </div>
            <div className="flex w-full p-1 outline outline-1 -outline-offset-1 outline-gray-300 rounded-md ">
              <label
                className="block w-36 self-center text-sm text-gray-400 "
                htmlFor="thumbnail_input"
              >
                Upload Thumbnail
              </label>
              <input
                ref={thumbnailRef}
                className="block h-fit self-center w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="thumbnail_input_help"
                id="thumbnail_input"
                type="file"
                accept="image/*"
              />
            </div>
            <div className="input-group flex flex-col w-full items-center">
              <button
                type="submit"
                className="mt-4 w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddVideoForm;

