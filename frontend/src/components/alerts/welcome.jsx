function Welcome({ user, alert }) {
    if (alert) {
        return (
            <div className="Welcome-Alert">
                <h2> Seja bem vindo {user.username}</h2>
            </div>
        )
    }
}

export default Welcome;