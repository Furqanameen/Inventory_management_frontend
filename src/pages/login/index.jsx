import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Center, Image, PasswordInput, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { AppLogo } from '../../assets';
import { Container } from '../../components/Container/Container';
import { AuthContext } from '../../context/Auth/AuthContext';
import api from '../../utils/api'; // Global API instance

// import { OtpForm } from './OtpForm';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // const sendOtp = async (paramUser) => {
  //   let userId = paramUser?._id || user?._id;

  //   try {
  //     const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  //     const otpResponse = await api.post('api/v1/auth/send-otp', { userId: userId, timezone });

  //     showNotification({
  //       color: 'blue',
  //       message: otpResponse?.data?.message || 'OTP sent successfully!',
  //     });
  //   } catch (error) {
  //     console.log('error', error);
  //     showNotification({ color: 'red', message: 'Failed to send OTP' });
  //   }
  // };

  // const onVerify = (token) => {
  //   login({ ...user, token });
  //   navigate('/');
  // };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      // setUser(response.data.data.user);
      // await sendOtp(response.data.data.user);
      localStorage.setItem('token', response.data.data.user.token); // Store JWT for persistence
      const user = response.data.data.user;
      login(user);
      showNotification({
        color: 'green',
        message: response.data.message || 'Login successful!',
      });
      navigate('/');

      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // if (step === 'otp') {
  //   return (
  //     <Container size="xs">
  //       <Center mih="75vh" mah="100vh" w="100%">
  //         <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
  //           <OtpForm user={user} sendOtp={sendOtp} onVerify={onVerify} />
  //         </Card>
  //       </Center>
  //     </Container>
  //   );
  // }

  return (
    <Container size="sm">
      <Center mih="75vh" mah="100vh" w="100%">
        <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
          <Center>
            <Image src={AppLogo} alt="Logo" width={100} height={100} mb="md" />
          </Center>
          <Title order={2} ta="center" mb="lg">
            {step === 'login' ? 'Welcome to inventory management' : 'Enter OTP'}
          </Title>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            mb="md"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            required
            mb="md"
          />

          <Button fullWidth mt="md" loading={loading} disabled={loading} onClick={handleLogin}>
            Login
          </Button>
          {error && (
            <Alert color="red" my={10}>
              {error}
            </Alert>
          )}
        </Card>
      </Center>
    </Container>
  );
}
