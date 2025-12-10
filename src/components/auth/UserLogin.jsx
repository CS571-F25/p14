import { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from './AuthContext';

export default function UserLogin() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already logged in
  if (userLoggedIn) {
    navigate("/");
    return null;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigate("/");
      } catch (error) {
        console.error(error);
        // Provide user-friendly error messages
        if (error.code === 'auth/user-not-found') {
          setErrorMessage("No account found with this email.");
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage("Incorrect password.");
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage("Invalid email address.");
        } else if (error.code === 'auth/invalid-credential') {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
        setIsSigningIn(false);
      }
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        navigate("/");
      } catch (error) {
        console.error(error);
        setErrorMessage("Google sign-in failed. Please try again.");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <h1 className="text-center mb-4">Login</h1>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleEmailLogin}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="emailInput">Email:</Form.Label>
            <Form.Control
              id="emailInput"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSigningIn}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="passwordInput">Password:</Form.Label>
            <Form.Control
              id="passwordInput"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningIn}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" disabled={isSigningIn}>
              {isSigningIn ? "Signing In..." : "Login"}
            </Button>

            <Button
              variant="outline-danger"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In with Google"}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <Link to="/UserRegister">
            <Button variant="outline-dark">Don't have an account? Sign Up</Button>
          </Link>
        </div>
      </Card>
    </Container>
  );
}