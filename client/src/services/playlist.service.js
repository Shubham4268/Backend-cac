import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_BASEURL;

export const getUserPlaylists = (userId) =>
  axios.get(`${BASE}/api/v1/playlists/user/${userId}`);

export const addToPlaylist = (videoId, playlistId) =>
  axios.patch(`${BASE}/api/v1/playlists/add/${videoId}/${playlistId}`);

export const removeFromPlaylist = (videoId, playlistId) =>
  axios.patch(`${BASE}/api/v1/playlists/remove/${videoId}/${playlistId}`);

export const createPlaylist = (name) =>
  axios.post(`${BASE}/api/v1/playlists`, { name });
