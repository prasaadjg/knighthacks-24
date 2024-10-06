"use client"

import { useState } from "react";

export default function TestAPI() {
  const [first, setFirst] = useState('second');

  function handleClick() {
    // API call
    console.log('posted');
  }
  
  return (
    <div>
      <input value={first} onChange={(e) => setFirst(e.target.value)} />

      <button onClick={handleClick}>Execute</button>
    </div>
  )
}