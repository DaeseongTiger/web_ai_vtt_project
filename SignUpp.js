import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: 'auto',
  maxWidth: '400px',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
  backgroundColor: theme.palette.background.paper,
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: '10vh',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
}));

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      try {
        const data = new FormData(event.currentTarget);
        const response = await fetch('http://localhost:3333/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password'),
            confirmPassword: data.get('confirm-password'),
          }),
        });
        const result = await response.json();

        if (response.ok) {
          console.log('Sign up successful:', result);
          alert('Sign up successful');
          navigate('/sign-in');
        } else {
          console.error('Sign up failed:', result);
          alert('Sign up failed: ' + result.message);
        }
      } catch (error) {
        console.error('Error during sign up:', error);
        alert('Error during sign up: ' + error.message);
      }
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    let isValid = true;

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Confirm password validation
    if (password.value !== confirmPassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <SignUpContainer direction="column" justifyContent="center" alignItems="center">
      <CssBaseline />
      <StyledCard>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 3, color: 'text.primary' }}>
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <TextField
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              name="confirm-password"
              placeholder="••••••"
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <CustomButton
            type="submit"
            fullWidth
          >
            Sign Up
          </CustomButton>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            Already have an account?{' '}
            <Link href="/sign-in" variant="body2">
              Sign In
            </Link>
          </Typography>
        </Box>
      </StyledCard>
    </SignUpContainer>
  );
}
