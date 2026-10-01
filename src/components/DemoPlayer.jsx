import { useRef, useState } from 'react';
import './DemoPlayer.css';

/**
 * Oyun demosunu sayfaya gömer. Oyun, ziyaretçi "Demoyu oyna"ya basana kadar
 * yüklenmez; böylece ~4 MB'lık içerik sayfa açılışını yavaşlatmaz.
 */
export default function DemoPlayer({
  src = '/demos/demir-kartal/index.html',
  poster = '/demos/demir-kartal/cover.jpg',
  title = 'Demir Kartal',
}) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef(null);

  const start = () => setPlaying(true);
   const fullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    const canFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (canFullscreen) {
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      el.focus();
    } else {
      // iPhone: Safari can't fullscreen a page, so open the game on its own page instead
      window.location.href = '/game.html';
    }
  };

  return (
    <div className="demo-player">
      {playing ? (
        <>
          <iframe
            ref={frameRef}
            src={src}
            title={`${title} — oynanabilir demo`}
            allow="fullscreen; autoplay"
            allowFullScreen
            onLoad={(e) => e.currentTarget.focus()}
          />
          <button type="button" className="demo-player__fs" onClick={fullscreen}>
            Fullscreen
          </button>
        </>
      ) : (
        <button
          type="button"
          className="demo-player__poster"
          style={{ backgroundImage: `url(${poster})` }}
          onClick={start}
          aria-label={`${title} demosunu oyna`}
        >
          <span className="demo-player__play">Play the demo</span>
          <span className="demo-player__hint">Keyboard & mouse recommended · ~4 MB</span>
        </button>
      )}
    </div>
  );
}
