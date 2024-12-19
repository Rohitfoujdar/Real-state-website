import React from 'react'
import { useAuth } from '../context/auth'

export default function Home() {
  const [auth, setAuth] = useAuth();
  return (
    <div>
      <h3 className="display-1 bg-primary p-5 text-light">Real state</h3>
      <pre>{JSON.stringify(auth,null,4)}</pre>
    </div>
  )
}
