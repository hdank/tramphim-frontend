import React, { useState } from 'react';
import FocusProvider from './FocusProvider.jsx';
import TVLayout from './Layout.jsx';
import Player from './Player.jsx';

export default function App() {
  const [playerProps, setPlayerProps] = useState(null);

  return (
    <FocusProvider>
      <TVLayout onPlay={(props) => setPlayerProps(props)} />
      {playerProps && (
        <Player
          key={playerProps.id || playerProps.src}
          src={playerProps.src}
          poster={playerProps.poster}
          title={playerProps.title}
          id={playerProps.id}
          onClose={() => setPlayerProps(null)}
        />
      )}
    </FocusProvider>
  );
}


