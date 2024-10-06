'use client'

import { useState, useEffect } from "react"; // You can now safely use hooks
import TestAPI from "../_components/test";
export default function page() {
    return (
      <div>
        <TestAPI></TestAPI>
      </div>
    )
  }