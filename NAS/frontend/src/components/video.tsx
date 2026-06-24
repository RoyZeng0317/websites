import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { apiJson } from "../lib/api"
import { func } from "prop-types"

interface video {
    id: number
    username: String
}

export default function video() {
    const { video } = useAuth()
}
