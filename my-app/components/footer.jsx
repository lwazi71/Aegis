
function Footer() {
    return (
        <footer className="py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-1">&copy; {new Date().getFullYear()} Aegis - All rights reserved.</p>
                <small className="text-muted">
                Built at WSU hackathon 
                </small>
            </div>
        </footer>
    )
}

export default Footer