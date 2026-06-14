"use client"

export default function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="p-4 m-2 bg-neutral-950 rounded flex flex-col gap-2"> 
                <input type="text" placeholder="email"></input>
                <input type="text" placeholder="password"></input>
                <button onClick={() => {

                }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    )
}