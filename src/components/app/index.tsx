


import React, { useState } from 'react';

import Trebuchet from '../trebuchet';

import './styles.css';

const PUZZLES = [
  {
    label: 'Day 1: Trebuchet',
    component: Trebuchet,
  },
];

const App = () => {
  const [ currentView, setCurrentView ] = useState( 0 );

  const View = PUZZLES[ currentView ].component;

  return (
    <div className="app">
      <aside className="app__sidebar">
        <header className="app__sidebar-header">Advent of Code</header>
        <p className="app__sidebar-subheader">2023</p>

        <nav className="app__sidebar-nav">
          { PUZZLES.map( ( { label }, idx ) => (
            <button
              key={ `day-${ idx }` }
              className="app__sidebar-nav-button"
              onClick={ () => setCurrentView( idx ) }
            >
              { label }
            </button>
          ) ) }
        </nav>
      </aside>
      <main className="app__view">
         <View />
      </main>
    </div>
  );
};

export default App;
