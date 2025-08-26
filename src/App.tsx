import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/Button/Button'
import { env } from './utils/env'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = env.APP_NAME
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{env.APP_NAME}</h1>
      <div className="card">
        <Button 
          primary
          label={`Count is ${count}`}
          onClick={() => setCount((count) => count + 1)}
        />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>Environment: {env.ENV}</p>
          <p>Version: {env.VERSION}</p>
          <p>API URL: {env.API_URL}</p>
          <p>OAuth Token URL: {env.OAUTH_TOKEN_URL}</p>
          <p>OAuth Client ID: {env.OAUTH_CLIENT_ID}</p>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
