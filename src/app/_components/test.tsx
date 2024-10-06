'use client'

import { useState, useEffect } from "react"; // You can now safely use hooks

export default function TestAPI() {
  const [first, setFirst] = useState('useState');

  function handleClick() {
    // API call
    console.log('Current input value:', first);
  }

  return (
    <div>
      <input value={first} onChange={(e) => setFirst(e.target.value)} />
      <button onClick={handleClick}>Execute</button>
    </div>
  )
}