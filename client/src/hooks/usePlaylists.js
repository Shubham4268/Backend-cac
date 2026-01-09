import { useState, useCallback, useEffect } from "react";
import * as playlistService from "../services/playlist.service";

export function usePlaylists(userId, notify) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    playlistService.getUserPlaylists(userId)
      .then(res => setPlaylists(res?.data?.data || []))
      .catch(err => setError(err.message));
  }, [userId]);

  const add = useCallback(async (videoId, playlistId) => {
    await playlistService.addToPlaylist(videoId, playlistId);
    notify?.("Video added to playlist");
  }, [notify]);

  const remove = useCallback(async (videoId, playlistId) => {
    await playlistService.removeFromPlaylist(videoId, playlistId);
    notify?.("Video removed from playlist");
  }, [notify]);

  const create = useCallback(async (name) => {
    const res = await playlistService.createPlaylist(name);
    setPlaylists(prev => [...prev, res.data.data]);
    return res.data.data;
  }, []);

  return { playlists, loading, error, add, remove, create };
}
