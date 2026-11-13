import logo from './logo (2).png';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Rastreador de Gastos</h1>
      </header>
      <main className="App-main">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
