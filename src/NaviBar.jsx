import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./components/auth/AuthContext";
import { doSignOut } from "./firebase/auth";

function NaviBar() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div>
            <Navbar bg="white" variant="light" expand="md" fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/" style={logoStyle}>Riffrate</Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-nav" />

                    <Navbar.Collapse id="main-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/" style={linkStyle}>Home</Nav.Link>
                            <Nav.Link as={Link} to="/ReviewByBand" style={linkStyle}>Band Reviews</Nav.Link>
                            <Nav.Link as={Link} to="/ReviewByVenue" style={linkStyle}>Venue Reviews</Nav.Link>
                            {userLoggedIn ? (
                                <>
                                    <Nav.Link as={Link} to="/UserProfile" style={linkStyle}>Your Reviews</Nav.Link>
                                    <Nav.Link onClick={handleLogout} style={{...linkStyle, cursor: 'pointer'}}>
                                        Log out
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/UserLogin" style={linkStyle}>Log in</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

const logoStyle = {
    fontWeight: "bold",
    fontSize: "50px",
    color: "#DD0426",
};

const linkStyle = {
    fontSize: "24px",
    padding: "10px 20px",
    color: "#333",
};

export default NaviBar;