import React from 'react';
import ReactDOM from 'react-dom/client';

function Hello(props) {
  return (
    <div>
      <h1>Hello World!</h1>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
    </div>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Hello />);
