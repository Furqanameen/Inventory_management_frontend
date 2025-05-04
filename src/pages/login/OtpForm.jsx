/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Box, Button, Center, Group, Image, Paper, PinInput, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { AppLogo } from '../../assets';
import api from '../../utils/api';

export function OtpForm({ user, onVerify, sendOtp }) {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Handle OTP submission
  const handleSubmit = async () => {
    if (otp.length === 6) {
      setLoading(true);
      try {
        const res = await api.post('api/v1/auth/verify-otp', {
          userId: user._id,
          code: Number(otp),
          token: user.token,
        });
        const token = res.data.data.token;

        showNotification({ color: 'green', message: 'OTP verified successfully!' });
        onVerify(token);
      } catch (error) {
        console.log('error', error);
        showNotification({ color: 'red', message: 'Invalid OTP code.' });
        // onVerify(false);
      } finally {
        setLoading(false);
      }
    } else {
      showNotification({ color: 'red', message: 'Please enter a valid OTP' });
    }
  };

  // Resend OTP logic with countdown
  const handleResend = () => {
    setOtp('');
    sendOtp();
    setIsResendDisabled(true);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Paper shadow="none" p="lg" radius="md" w="100%">
      <Center>
        <Image src={AppLogo} alt="Logo" width={100} height={100} mb="md" />
      </Center>
      <Text size="xl" fw={600} ta="center" mb="xs">
        Enter OTP Code
      </Text>

      <Text p="md" ta="center" mb="lg">
        <Text size="md">
          We&apos;ve sent a 6-digit OTP to your email{' '}
          <Text component="span" fw={700} c="primary" fs="italic">
            {user.email}
          </Text>
          . Please enter it below. The OTP is valid for{' '}
          <Text component="span" fw={700} c="primary">
            5 minutes
          </Text>
          .
        </Text>
      </Text>

      <Group align="center" mb="md" w="100%">
        <PinInput
          ta="center"
          length={6}
          value={otp}
          onChange={setOtp}
          type="number"
          size="lg"
          oneTimeCode
          autoFocus
          style={{
            justifyContent: 'center',
            width: '100%',
          }}
        />
      </Group>

      <Button
        fullWidth
        size="md"
        onClick={handleSubmit}
        disabled={otp.length !== 6 || loading}
        loading={loading}
      >
        Verify OTP
      </Button>

      <Box mt="md" ta="center">
        <Text size="sm" ta="center">
          Didn’t receive the code?{' '}
          <Button variant="subtle" onClick={handleResend} disabled={isResendDisabled} size="sm">
            Resend OTP {isResendDisabled && `(${resendTimer}s)`}
          </Button>
        </Text>
      </Box>
    </Paper>
  );
}
