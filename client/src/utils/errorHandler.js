export const handleApiError = (err, setError) => {
    if (err.response) {
      // Backend returned an error response
      setError(err.response.data.message || "An error occurred.");
    } else if (err.request) {
      // Request was made, but no response was received
      setError("No response from the server. Please try again.");
    } else {
      // Something else caused the error
      setError(err.message || "An unexpected error occurred.");
    }
  };
  