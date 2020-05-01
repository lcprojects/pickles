import React from 'react';

import ColorPicker from './ColorPicker'

function App() {
  return (
    <React.Fragment>
      <ColorPicker value="rgba(80,80,80,1)" onColorChange={(color) => console.log(color)}/>
    </React.Fragment>
  );
}

export default App;
