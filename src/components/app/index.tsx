import React, { useState } from 'react';
import classnames from 'classnames';

import Trebuchet from '../trebuchet';
import CubeConundrum from '../cube-conundrum';

import './styles.css';

const PUZZLES = [
  {
    label: 'Day 1: Trebuchet',
    component: Trebuchet,
  },
  {
    label: 'Day 2: Cube Conundrum',
    component: CubeConundrum,
  }
];

const App = () => {
  const [ currentView, setCurrentView ] = useState( 0 );

  const View = PUZZLES[ currentView ].component;

  console.log( PUZZLES[ currentView ].label );

  return (
    <div className="app">
      <aside className="app__sidebar">
        <header className="app__sidebar-header">Advent of Code</header>
        <p className="app__sidebar-subheader">2023</p>

        <nav className="app__sidebar-nav">
          { PUZZLES.map( ( { label }, idx ) => (
            <button
              key={ `day-${ idx }` }
              className={ classnames( 'app__sidebar-nav-button', { 'is-active': idx === currentView } ) }
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
