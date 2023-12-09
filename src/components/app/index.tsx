import React, { useState } from 'react';
import classnames from 'classnames';

import Trebuchet from '../trebuchet';
import Cards from '../cards';
import CubeConundrum from '../cube-conundrum';
import GearRatios from '../gear-ratios';
import Glider from '../glider';
import Scratchcards from '../scratchcards';
import Seeds from '../seeds';
import WaitForIt from '../wait-for-it';
import Wasteland from '../wasteland';

import './styles.css';

const PUZZLES = [
  {
    day: 1,
    label: 'Trebuchet',
    component: Trebuchet,
  },
  {
    day: 2,
    label: 'Cube Conundrum',
    component: CubeConundrum,
  },
  {
    day: 3,
    label: 'Gear Ratios',
    component: GearRatios,
  },
  {
    day: 4,
    label: 'Scratchcards',
    component: Scratchcards,
  },
  {
    day: 5,
    label: 'If You Give A Seed A Fertilizer',
    component: Seeds,
  },
  {
    day: 6,
    label: 'Wait For It',
    component: WaitForIt,
  },
  {
    day: 7,
    label: 'Camel Cards',
    component: Cards,
  },
  {
    day: 8,
    label: 'Haunted Wasteland',
    component: Wasteland,
  },
  {
    day: 9,
    label: 'Mirage Maintenance',
    component: Glider,
  }
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
          { PUZZLES.map( ( { day, label }, idx ) => (
            <button
              key={ `day-${ idx }` }
              className={ classnames( 'app__sidebar-nav-button', { 'is-active': idx === currentView } ) }
              onClick={ () => setCurrentView( idx ) }
            >
              <span className="app__sidebar-nav-button-day">
                { `Day${ day < 10 ? ' ' : Math.floor( day / 10 ) }${ day }: ` }
              </span>

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
