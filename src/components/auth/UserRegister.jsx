import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';

/* TODO
- username input
- password input
- password conf input
- submit button + redirect to homepage (and logs them in)
- login button on nav bar should change to a logout button
*/

export default function UserRegister (props) {

    const navigate = useNavigate();

    function handleLogIn(e) {
        /* TODO */
        navigate("/");
    }

    return <div>
        <h1>Sign up Below</h1>
        <Form onSubmit={handleLogIn}>
            <Form.Label htmlFor="usernameInput">Username:</Form.Label>
            <Form.Control id="usernameInput" />
            <Form.Label htmlFor="passwordInput">Password:</Form.Label>
            <Form.Control id="passwordInput" type="password" />
            <Form.Label htmlFor="confPasswordInput">Confirm Password:</Form.Label>
            <Form.Control id="confPasswordInput" type="password" />
            <br />
            <Button type="submit">Login</Button>
        </Form>
        <br />
        <br />
        <Link to="/UserLogin">
                <button type="button" className="btn btn-outline-dark">Have an account?</button>
            </Link>
    </div>
}