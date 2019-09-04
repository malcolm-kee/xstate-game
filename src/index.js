import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './app';
import { preloadImages } from './lib/dom';
import { foodImages } from './images/food-images';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'), () =>
  // preload all food images so it will be shown instantly when game start
  preloadImages(...Object.values(foodImages))
);

serviceWorker.register();
