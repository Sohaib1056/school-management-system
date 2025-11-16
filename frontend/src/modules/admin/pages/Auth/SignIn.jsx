import React, { useState } from 'react';
import { Box, Flex, Heading, Text, Button, Input, InputGroup, InputLeftElement, FormControl, FormLabel, Checkbox, Link, useToast, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleSignIn = () => {
    setLoading(true);
    toast({ title: 'Signing in...', status: 'info', duration: 1200, isClosable: true });
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Welcome back!', status: 'success', duration: 1500, isClosable: true });
      navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex direction='column' align='center' justify='center'>
        <Heading size='lg' mb={2}>Sign In</Heading>
        <Text color={textColorSecondary} mb={8}>Access your school management dashboard</Text>

        <Card maxW='480px' w='100%' p={8}>
          <VStack spacing={4} align='stretch'>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <Icon as={MdEmail} color='gray.400' />
                </InputLeftElement>
                <Input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='you@example.com' />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <Icon as={MdLock} color='gray.400' />
                </InputLeftElement>
                <Input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='••••••••' />
              </InputGroup>
            </FormControl>
            <Flex align='center' justify='space-between'>
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Link color='blue.500'>Forgot password?</Link>
            </Flex>
            <Button colorScheme='blue' leftIcon={<MdLogin />} isLoading={loading} onClick={handleSignIn}>Sign In</Button>
          </VStack>
        </Card>
      </Flex>
    </Box>
  );
}
