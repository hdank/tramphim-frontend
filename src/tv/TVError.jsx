import React from 'react';

export default function TVError({ title = 'Network error', message = 'Please check your connection and try again.' }) {
  return (
    <div style={{padding:24, background:'#111', color:'#fff', borderRadius:8, maxWidth:800}}>
      <h3 style={{fontSize:22, marginBottom:8}}>{title}</h3>
      <p style={{opacity:0.9}}>{message}</p>
      <div style={{marginTop:16}}>
        <button style={{padding:'10px 16px', fontSize:16}} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </div>
  );
}


