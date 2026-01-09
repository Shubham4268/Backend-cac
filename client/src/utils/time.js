export const getTimeDifference = (createdAt) => {
  if (!createdAt) return "";
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const diffInMs = currentDate - createdDate;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInMinutes < 60)
    return diffInMinutes < 2
      ? `${diffInMinutes} minute ago`
      : `${diffInMinutes} minutes ago`;
  if (diffInHours < 24)
    return diffInHours < 2
      ? `${diffInHours} hour ago`
      : `${diffInHours} hours ago`;
  if (diffInDays < 30)
    return diffInDays < 2
      ? `${diffInDays} day ago`
      : `${diffInDays} days ago`;
  if (diffInMonths < 12)
    return diffInMonths < 2
      ? `${diffInMonths} month ago`
      : `${diffInMonths} months ago`;
  return diffInYears < 2
    ? `${diffInYears} year ago`
    : `${diffInYears} years ago`;
};

export const formatDuration = (durationInSeconds) => {
  if (!durationInSeconds && durationInSeconds !== 0) return "0:00";
  const roundedSeconds = Math.round(durationInSeconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
