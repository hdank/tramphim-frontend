import React, { useEffect, useState } from 'react';
import { getHomePageData } from '../utils/getMovieHome.js';
import TVRow from './TVRow.jsx';

export default function TVLayout({ onPlay }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getHomePageData();
        if (!mounted) return;
        // pick a curated set of row keys and their titles
        const curated = [
          { key: 'moviehots', title: 'Hot' },
          { key: 'movieheros', title: 'New & Updated' },
          { key: 'moviephimles', title: 'Movies' },
          { key: 'moviephimbos', title: 'Series' },
          { key: 'movieanimes', title: 'Anime' }
        ];

        const prepared = curated
          .map((c) => ({ title: c.title, movies: data[c.key] || [] }))
          .filter((r) => r.movies && r.movies.length > 0);

        setRows(prepared);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="tv-layout" style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'24px', boxSizing:'border-box'}}>
      <header style={{fontSize:36, fontWeight:700, marginBottom:20}}>TramPhim TV</header>
      <main>
        {loading && <div style={{opacity:0.8}}>Loading...</div>}
        {error && <div style={{color:'#f33'}}>Failed to load content.</div>}

        {rows.map((row, rowIndex) => (
          <section key={row.title} aria-label={row.title} style={{marginBottom:28}}>
            <h2 style={{fontSize:22, marginBottom:12}}>{row.title}</h2>
            <TVRow
              rowIndex={rowIndex}
              movies={row.movies}
              onPlay={(movie) => {
                const src = movie?.stream_url || movie?.video_url || movie?.file || '';
                onPlay && onPlay({ src, poster: movie.poster_url, title: movie.ten_phim || movie.ten_khac, id: movie.id || movie.slug });
              }}
            />
          </section>
        ))}
      </main>
    </div>
  );
}


