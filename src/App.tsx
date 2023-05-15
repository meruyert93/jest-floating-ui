import React from 'react';

import './App.css';
import Tooltip from './Tooltip';

function App() {
  return (
    <div className="App">
      <h1>Jest Floating Ui Test</h1>
      <Tooltip text={'tooltip'}><div>foo</div></Tooltip>
    </div>
  );
}

export default App;
