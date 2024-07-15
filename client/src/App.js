
import './App.css';
import './index.css';
import React, { useEffect, useState } from 'react';
import NavigationHeader from './routes/Dual/NavigationHeader';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    
    <div className="App">
      <NavigationHeader />
      <header className="App-header">
        <p>{data ? data : 'Loading...'}</p>
      </header>
      
    </div>
  );
}


export default App;
