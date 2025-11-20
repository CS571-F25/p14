import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';

/* TODO
- username input
- password input
- submit button + redirect to homepage
- signup button if they don't have a login
- login button on nav bar should change to a logout button
*/


export default function UserLogin (props) {

    const username = ""; //FIXME
    const password = ""; //FIXME

    const navigate = useNavigate();

    function handleLogIn(e) {
        /* TODO */
        navigate("/");
    }

    return <div>
        <h1>Login Below</h1>
        <Form onSubmit={handleLogIn}>
            <Form.Label htmlFor="usernameInput">Username:</Form.Label>
            <Form.Control id="usernameInput" />
            <Form.Label htmlFor="passwordInput">Password:</Form.Label>
            <Form.Control id="passwordInput" type="password" />
            <br />
            <Button type="submit">Login</Button>
        </Form>
        <br />
        <br />
        <Link to="/UserRegister">
                <button type="button" className="btn btn-outline-dark">Don't have an account?</button>
            </Link>
    </div>
}