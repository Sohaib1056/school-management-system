import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Input,
  Button,
  Icon,
  InputGroup,
  InputRightElement,
  Progress,
  useColorModeValue,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { MdRefresh, MdSave, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Card from '../../../components/card/Card';

export default function Password() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const strength = useMemo(() => {
    let s = 0;
    if (next.length >= 8) s += 25;
    if (/[A-Z]/.test(next)) s += 25;
    if (/[0-9]/.test(next)) s += 25;
    if (/[^A-Za-z0-9]/.test(next)) s += 25;
    return s;
  }, [next]);

  const mismatch = confirm && next !== confirm;

  const reset = () => { setCurrent(''); setNext(''); setConfirm(''); setTwoFA(false); };
  const save = () => {
    console.log('Password updated');
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Password</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Update your password and security preferences</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Strength</Text><Text fontSize='3xl' fontWeight='800'>{strength}%</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>2FA</Text><Text fontSize='3xl' fontWeight='800'>{twoFA ? 'Enabled' : 'Disabled'}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Requirements</Text><Text fontSize='3xl' fontWeight='800'>8+ chars</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px'>
        <VStack align='stretch' spacing={4}>
          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <InputGroup size='sm'>
              <Input type={show1 ? 'text' : 'password'} value={current} onChange={e=>setCurrent(e.target.value)} />
              <InputRightElement>
                <Icon as={show1?MdVisibilityOff:MdVisibility} cursor='pointer' onClick={()=>setShow1(s=>!s)} />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <InputGroup size='sm'>
              <Input type={show2 ? 'text' : 'password'} value={next} onChange={e=>setNext(e.target.value)} />
              <InputRightElement>
                <Icon as={show2?MdVisibilityOff:MdVisibility} cursor='pointer' onClick={()=>setShow2(s=>!s)} />
              </InputRightElement>
            </InputGroup>
            <Progress mt={2} value={strength} size='sm' colorScheme={strength<50?'red':strength<75?'yellow':'green'} />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size='sm'>
              <Input type={show3 ? 'text' : 'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} isInvalid={mismatch} />
              <InputRightElement>
                <Icon as={show3?MdVisibilityOff:MdVisibility} cursor='pointer' onClick={()=>setShow3(s=>!s)} />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <FormControl display='flex' alignItems='center' width='auto'>
              <FormLabel htmlFor='twoFA' mb='0'>Enable Two‑Factor</FormLabel>
              <Switch id='twoFA' isChecked={twoFA} onChange={(e)=>setTwoFA(e.target.checked)} />
            </FormControl>
            <Tooltip label='Receive an email when your password changes'>
              <Switch colorScheme='blue' />
            </Tooltip>
          </HStack>

          <Flex justify='flex-end' gap={2} flexWrap='wrap' rowGap={3}>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={reset}>Reset</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdSave} />} isDisabled={!current || !next || mismatch || strength<50} onClick={save}>Save</Button>
          </Flex>
        </VStack>
      </Card>
    </Box>
  );
}
