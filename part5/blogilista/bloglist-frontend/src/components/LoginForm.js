const LoginForm=({username, password,
    handleSubmit,handleUsernameChange,handlePasswordChange,
})=>{
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    username: <input type="text" 
                                value={username} 
                                onChange={handleUsernameChange}>
                                </input>
                </div>
                <div>
                    password: <input type="password" 
                                value={password} 
                                onChange={handlePasswordChange}>
                                </input>
                </div>
            <button type="submit">login</button>
            </form>
        </div>   
    )
}

export default LoginForm