import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export default function VideoFile({ video }) {
  const { videoFile: url = "" } = video || {};
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true); // default HTML autoPlay was true
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      const vol = volume > 0 ? volume : 1;
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard and idle controls hiding logic
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (isPlaying) setShowControls(false);
    };

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      
      switch(e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowright":
          e.preventDefault();
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
          break;
        case "arrowleft":
          e.preventDefault();
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
          break;
        case "arrowup":
          e.preventDefault();
          {
            const newVolUp = Math.min(volume + 0.1, 1);
            setVolume(newVolUp);
            videoRef.current.volume = newVolUp;
            setIsMuted(newVolUp === 0);
          }
          break;
        case "arrowdown":
          e.preventDefault();
          {
            const newVolDown = Math.max(volume - 0.1, 0);
            setVolume(newVolDown);
            videoRef.current.volume = newVolDown;
            setIsMuted(newVolDown === 0);
          }
          break;
        default:
          break;
      }
      handleMouseMove(); 
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      // document listener ensures keys work globally on this page
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, duration, volume]);

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleVideoDoubleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      // Right side - forward 10s
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    } else {
      // Left side - backward 10s
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black group overflow-hidden select-none flex justify-center items-center rounded-lg shadow-xl"
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
        loop
      />

      {/* Center Play Indicator */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 transform scale-100 opacity-100"
          onClick={handleVideoClick}
        >
          <div className="bg-black/40 backdrop-blur-md text-white p-5 rounded-full border border-white/20 shadow-2xl">
            <Play size={40} className="ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 ease-in-out ${showControls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"} flex flex-col gap-2`}
      >
        {/* Scrubber Timeline */}
        <div className="flex items-center group/scrubber cursor-pointer w-full relative h-4">
           {/* Visual Track */}
           <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-white/20 pointer-events-none group-hover/scrubber:h-2 transition-all duration-200 overflow-hidden">
             <div 
               className="h-full bg-indigo-500 transition-all duration-75 relative"
               style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
             />
           </div>
           {/* Visual Thumb - Positioned precisely */}
           <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow pointer-events-none opacity-0 group-hover/scrubber:opacity-100 scale-50 group-hover/scrubber:scale-100 transition-all z-10"
              style={{ left: `calc(${(currentTime / duration) * 100 || 0}% - 8px)` }}
           />
           {/* Range Input */}
           <input 
             type="range"
             min="0"
             max={duration || 100}
             value={currentTime}
             onChange={handleSeek}
             className="absolute w-full h-full opacity-0 cursor-pointer"
             aria-label="Seek timeline"
           />
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between text-white mt-1">
          <div className="flex items-center gap-5">
            {/* Play/Pause */}
            <button 
              onClick={togglePlay} 
              className="hover:text-indigo-400 focus:outline-none transition active:scale-90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume relative">
              <button 
                onClick={toggleMute}
                className="hover:text-indigo-400 focus:outline-none transition active:scale-90"  
                aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <div className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 ease-out origin-left flex items-center relative h-6">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-white/30 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  aria-label="Volume slider"
                />
              </div>
            </div>
            
            {/* Time Indicator */}
            <div className="text-xs font-semibold tracking-wide font-mono opacity-90 select-none">
              {formatTime(currentTime)} <span className="opacity-50 mx-0.5">/</span> {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Fullscreen Full toggle */}
            <button 
              onClick={toggleFullscreen}
              className="hover:text-indigo-400 focus:outline-none transition active:scale-90"  
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
