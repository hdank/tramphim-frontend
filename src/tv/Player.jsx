import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function Player({ src = '', poster = '', title = '', id = '', onClose = () => {} }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // restore resume position if present
    try {
      const resumeKey = `resume:${id || src}`;
      const resumePos = parseFloat(localStorage.getItem(resumeKey) || '0');
      if (resumePos > 2) video.currentTime = resumePos;
    } catch (err) {
      // ignore
    }

    // HLS playback (web) - use native if browser supports HLS natively
    if (Hls.isSupported() && src) {
      const hls = new Hls({ maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS error', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      // fallback: set src directly
      video.src = src;
    }

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);

    // save resume position periodically
    const saveInterval = setInterval(() => {
      try {
        const resumeKey = `resume:${id || src}`;
        localStorage.setItem(resumeKey, String(video.currentTime || 0));
      } catch (err) {}
    }, 2000);

    // media session
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: title || 'TramPhim',
        artist: 'TramPhim',
        artwork: poster ? [{ src: poster, sizes: '512x512', type: 'image/png' }] : []
      });

      navigator.mediaSession.setActionHandler('play', () => video.play().catch(()=>{}));
      navigator.mediaSession.setActionHandler('pause', () => video.pause());
      navigator.mediaSession.setActionHandler('seekbackward', (ev) => {
        video.currentTime = Math.max(0, video.currentTime - (ev.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('seekforward', (ev) => {
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + (ev.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        video.pause();
        video.currentTime = 0;
      });
    }

    return () => {
      clearInterval(saveInterval);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, id, title, poster]);

  return (
    <div
      className="tv-player-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{width:'80%', maxWidth:1280, position:'relative'}}>
        <button
          onClick={() => { try { videoRef.current.pause(); } catch{}; onClose(); }}
          style={{position:'absolute', right:8, top:8, zIndex:10, fontSize:18, padding:'8px 12px'}}
        >
          Close
        </button>
        <video
          ref={videoRef}
          controls
          poster={poster}
          style={{width:'100%', background:'#000', borderRadius:8}}
        />
        {isBuffering && (
          <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', color:'#fff'}}>
            Buffering...
          </div>
        )}
      </div>
    </div>
  );
}


