import './App.css'
import { useAuth } from './features/auth/AuthContext';

function App() {
  const {isLoading} = useAuth();
  if (isLoading){
    return <div>Loading</div>;
  }
  return (
    <>
      <div>
      </div>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
