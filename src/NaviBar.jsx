import { Container, Nav, Navbar } from "react-bootstrap";
import { useContext } from 'react';
import { Link } from "react-router";
import UserLoginStatus from "./components/context/UserLoginStatus";

/* TODO
- navigate between:
    - user reviews
    - band reviews
    - venue reviews
- if user is logged in, a log out button should appear
- if user is logged out, a log in button should appear
- clicking riffrate should take users to the home page
*/

function NaviBar(props) {
    const [loginStatus, setLoginStatus] = useContext(UserLoginStatus);

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
                            {/* TODO: LOG OUT/LOG IN */}
                            { loginStatus ? 
                                <>
                                    <Nav.Link as={Link} to="/ReviewPage" style={linkStyle}>Your Reviews</Nav.Link>
                                    <Nav.Link as={Link} to="/" style={linkStyle}>Log out</Nav.Link> 
                                </> : <Nav.Link as={Link} to="/UserLogin" style={linkStyle}>Log in</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
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