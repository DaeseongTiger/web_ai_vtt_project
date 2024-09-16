import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
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
  gap: theme.spacing(2),
  margin: 'auto',
  maxWidth: '400px', // ลดขนาดการแสดงผลของการ์ด
  borderRadius: theme.shape.borderRadius * 2, // เพิ่มมุมโค้งมน
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // เพิ่มเงาให้การ์ด
  backgroundColor: theme.palette.background.paper, // ใช้สีพื้นหลังของธีม
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      try {
        const response = await fetch('http://localhost:3333/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const result = await response.json();
          console.log('Sign in successful:', result);
          alert('Sign in successful!');
          localStorage.setItem('token', result.token);
          navigate('/dashboard');
        } else {
          console.error('Sign in failed');
          alert('Sign in failed. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Error during sign in:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <SignInContainer direction="column" justifyContent="center" alignItems="center">
      <CssBaseline />
      <StyledCard>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 2, color: 'text.primary' }}>
          Sign In
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <CustomButton
            type="submit"
            fullWidth
          >
            Sign In
          </CustomButton>
          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/sign-up" variant="body2">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </StyledCard>
    </SignInContainer>
  );
}
