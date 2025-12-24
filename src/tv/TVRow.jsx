import React from 'react';

function FocusableItem({ movie, rowIndex, colIndex, onPlay }) {
  const handleKey = (e) => {
    // Enter plays the movie
    if (e.key === 'Enter') {
      e.preventDefault();
      onPlay && onPlay(movie);
    }
  };

  return (
    <button
      className="tv-item"
      data-row={rowIndex}
      data-col={colIndex}
      onKeyDown={handleKey}
      onClick={() => onPlay && onPlay(movie)}
      style={{
        width: 300,
        height: 170,
        display: 'inline-block',
        marginRight: 16,
        background: '#111',
        borderRadius: 8,
        overflow: 'hidden',
        textAlign: 'left',
        padding: 8,
        color: '#fff',
      }}
    >
      <img
        src={movie.poster_url}
        alt={movie.ten_phim || movie.ten_khac}
        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }}
        loading="lazy"
      />
      <div style={{marginTop:8, fontSize:16, fontWeight:600}}>{movie.ten_phim}</div>
      <div style={{opacity:0.8, fontSize:13}}>{movie.ten_khac}</div>
    </button>
  );
}

export default function TVRow({ movies = [], rowIndex = 0, onPlay = () => {} }) {
  return (
    <div className="tv-row" role="list" style={{whiteSpace:'nowrap', overflowX:'auto', paddingBottom:6}}>
      {movies.map((movie, idx) => (
        <FocusableItem key={movie.id || movie.slug || idx} movie={movie} rowIndex={rowIndex} colIndex={idx} onPlay={onPlay} />
      ))}
    </div>
  );
}


