import React from 'react';

import './App.css';
import Tooltip from './Tooltip';
import {Dropdown} from './Dropdown'

const options = [
  { label: 'item1', value: 'item1' },
  { label: 'item2', value: 'item2' },
  { label: 'item3', value: 'item3' },
  { label: 'item4', value: 'item4' },
  { label: 'item5', value: 'item5' },
];

function App() {
  return (
    <div className="App">
      <h1>Jest Floating Ui Test</h1>
      <Tooltip text={'tooltip'}><div>foo</div></Tooltip>
      <Dropdown options={options} triggerElement={<div>trigger</div>}></Dropdown>
    </div>
  );
}

export default App;
