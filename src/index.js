import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './app';
import { preloadImages } from './lib/dom';

ReactDOM.render(<App />, document.getElementById('root'), () =>
  // preload all food images so it will be shown instantly when game start
  preloadImages(
    './nasilemak.png',
    './asamlaksa.png',
    './bandung.png',
    './kopi.png',
    './limauais.png',
    './ayamrendang.png',
    './rotibakar.png',
    './roticanai.png',
    './soyacincau.png',
    './tehtarik.png'
  )
);
