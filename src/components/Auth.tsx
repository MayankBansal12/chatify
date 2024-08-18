import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageNotFound from './PageNotFound'
import { toast } from 'react-toastify'

const BACKEND = import.meta.env.VITE_SERVER

type Props = {}

export interface SignupEvent {
    target: {
        email: HTMLInputElement
        name: HTMLInputElement
        username: HTMLInputElement
        password: HTMLInputElement
        confirmPassword: HTMLInputElement
    }
}
export interface LoginEvent {
    target: {
        email: HTMLInputElement
        password: HTMLInputElement
    }
}

const Auth = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [query] = useSearchParams()
    const [redirectURL, setredirectURL] = useState<string | null>(null)
    const { authType } = useParams()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement> & LoginEvent) => {
        e.preventDefault()
        console.log("log in")

        try {
            const email = e.target.email.value
            const password = e.target.password.value

            console.log(email, password)

            if (!email || !password) {
                toast("All the fields are required!", {
                    position: "bottom-right",
                    type: "info",
                    autoClose: 3000,
                });
                return;
            }

            setLoading(true)
            const res = await fetch(`${BACKEND}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            console.log(data)
            if (res.ok) {
                const token = data.token
                localStorage.setItem('token', token)
                localStorage.setItem('userId', data?.userId)
                toast(data?.message || "Login success", {
                    position: "bottom-right",
                    type: "success",
                    autoClose: 3000,
                });
                navigate("/")
            } else {
                console.log(data?.message)
                toast(data?.message || data?.error || "Error, try again!", {
                    position: "bottom-right",
                    type: "error",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log(error)
            toast("Error, try again!", {
                position: "bottom-right",
                type: "error",
                autoClose: 3000,
            });
        } finally {
            setLoading(false)
        }
    }
    const handleSignup = async (e: React.FormEvent<HTMLFormElement> & SignupEvent) => {
        e.preventDefault()
        console.log("sign up")

        try {
            const email = e.target.email.value
            const name = e.target.name.value
            const username = e.target.username.value
            const password = e.target.password.value
            const confirmPassword = e.target.confirmPassword.value

            if (!email || !name || !username || !password || !confirmPassword) {
                toast("All the fields are required!", {
                    position: "bottom-right",
                    type: "info",
                    autoClose: 3000,
                });
                return;
            }

            if (password !== confirmPassword) {
                toast("Passwords don't match!", {
                    position: "bottom-right",
                    type: "info",
                    autoClose: 3000,
                });
                return;
            }

            setLoading(true)
            const res = await fetch(`${BACKEND}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    username,
                    password
                }),
            })

            const data = await res.json()
            if (res.ok) {
                // show data.message success message
                const token = data.token
                localStorage.setItem('token', token)
                localStorage.setItem('userId', data?.userId)
                toast(data?.message || "User Registered", {
                    position: "bottom-right",
                    type: "success",
                    autoClose: 3000,
                });
                navigate("/")
            } else {
                toast((data?.message || data?.error || "Error, try again!") + ", make sure email, username is unique", {
                    position: "bottom-right",
                    type: "error",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log(error)
            toast("Error, try again!", {
                position: "bottom-right",
                type: "error",
                autoClose: 3000,
            });
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        setredirectURL(query.get('redirect') || null)
    }, [query])

    if (authType !== 'login' && authType !== 'register') return <PageNotFound />
    return (
        <div className="flex justify-center items-center py-10 md:py-20 w-full h-screen font-josefin">
            <div className="flex flex-col items-center justify-center border-2 bg-[var(--primary-color)] px-2 md:px-10 py-4 md:py-10 text-center w-4/5 md:w-2/3 h-[90vh]">
                <p className="text-xl md:text-3xl">
                    Welcome to {''}
                    <span className="font-title text-3xl md:text-5xl">
                        Chatify
                    </span>
                </p>
                <div className="pb-4 pt-1">
                    <h1>Start chatting with your friends! But First,</h1>
                    <h2>{authType === 'login' ? 'Login into your account' : 'Register your account'} to access the app!</h2>
                </div>
                {!authType || authType === 'login' ? (
                    <form onSubmit={handleLogin}>
                        {/* login form */}
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="email"
                            placeholder="Email"
                            name="email"
                            required
                        />
                        <br />
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="password"
                            placeholder="Password"
                            name="password"
                            required
                        />
                        <br />
                        <p className="py-4">
                            If you dont have an account already.
                            <br /> Please{' '}
                            <Link
                                to={
                                    redirectURL
                                        ? `/auth/register?redirect=${redirectURL}`
                                        : '/auth/register'
                                }
                                className="text-[var(--text-color)]"
                            >
                                {' '}
                                Create an Account.
                            </Link>
                        </p>
                        <br />
                        <button className="bg-[var(--cta-color)] py-2 px-4 text-lg text-white cursor-pointer rounded-md hover:scale-105 transition-all disabled:opacity-50" disabled={loading}> {loading ? "logging in..." : "Login"}</button>
                    </form>
                ) : (
                    <form
                        onSubmit={handleSignup}
                        encType="multipart/form-data"
                        className="flex flex-col items-center my-2"
                    >
                        {/* signup form */}

                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="email"
                            placeholder="Email"
                            name="email"
                            required
                        />
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="text"
                            placeholder="A unique username"
                            name="username"
                            required
                        />
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="text"
                            placeholder="Name"
                            name="name"
                            required
                        />
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="password"
                            placeholder="Password"
                            name="password"
                            required
                        />
                        <input
                            className="border-[var(--accent-color)] bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-2/3 md:min-w-80 focus:outline-none"
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            required
                        />
                        <p className="py-4">
                            If you have an account already.
                            <br /> Please{' '}
                            <Link
                                to={
                                    redirectURL
                                        ? `/auth/login?redirect=${redirectURL}`
                                        : '/auth/login'
                                }
                                className="text-[var(--text-color)]"
                            >
                                Login
                            </Link>
                        </p>
                        <button className="bg-[var(--cta-color)] py-2 px-4 text-lg text-white cursor-pointer rounded-md hover:scale-105 transition-all disabled:opacity-50" disabled={loading}> {loading ? "signing up..." : "Signup"}</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Auth