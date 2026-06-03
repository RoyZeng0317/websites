import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase'

export default function PortfolioOverview() {
  return (
    <div className="text-white p-4">
      Portfolio Overview
    </div>
  )
}
