import { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from './AuthContext';

/* TODO
- username input
- password input
- password conf input
- submit button + redirect to homepage (and logs them in)
- login button on nav bar should change to a logout button
*/

export default function UserRegister() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Redirect if already logged in
  if (userLoggedIn) {
    navigate("/");
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigate("/");
      } catch (error) {
        console.error(error);
        // Provide user-friendly error messages
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage("An account with this email already exists.");
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage("Invalid email address.");
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage("Password is too weak. Please use a stronger password.");
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
        setIsRegistering(false);
      }
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doSignInWithGoogle();
        navigate("/");
      } catch (error) {
        console.error(error);
        setErrorMessage("Google sign-in failed. Please try again.");
        setIsRegistering(false);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <h1 className="text-center mb-4">Sign Up</h1>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="emailInput">Email:</Form.Label>
            <Form.Control
              id="emailInput"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isRegistering}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="passwordInput">Password:</Form.Label>
            <Form.Control
              id="passwordInput"
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isRegistering}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="confPasswordInput">Confirm Password:</Form.Label>
            <Form.Control
              id="confPasswordInput"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isRegistering}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" disabled={isRegistering}>
              {isRegistering ? "Creating Account..." : "Sign Up"}
            </Button>

            <Button
              variant="outline-danger"
              onClick={handleGoogleSignIn}
              disabled={isRegistering}
            >
              {isRegistering ? "Signing In..." : "Sign Up with Google"}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <Link to="/UserLogin">
            <Button variant="outline-dark">Already have an account? Login</Button>
          </Link>
        </div>
      </Card>
    </Container>
  );
}