import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Input,
  Select,
  Textarea,
  Button,
  Icon,
  Avatar,
  useColorModeValue,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { MdRefresh, MdSave } from 'react-icons/md';
import Card from '../../../components/card/Card';

const initialProfile = {
  name: 'John Doe',
  email: 'john.doe@school.edu',
  phone: '+92 300 1234567',
  designation: 'Senior Teacher',
  department: 'Mathematics',
  gender: 'Male',
  address: 'House #12, Street 5, DHA, Lahore',
  city: 'Lahore',
  avatar: '',
  twoFA: false,
};

export default function Profile() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const [form, setForm] = useState(initialProfile);

  const kpis = useMemo(() => ({
    classes: 4,
    students: 120,
    tenure: '3y 7m',
  }), []);

  const reset = () => setForm(initialProfile);
  const save = () => {
    // demo only
    console.log('Profile saved', form);
  };

  const handle = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target ? e.target.value : e }));

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Profile</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Manage personal information and account settings</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Classes</Text><Text fontSize='3xl' fontWeight='800'>{kpis.classes}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Students</Text><Text fontSize='3xl' fontWeight='800'>{kpis.students}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Tenure</Text><Text fontSize='3xl' fontWeight='800'>{kpis.tenure}</Text></VStack></Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing='16px'>
        <Card p='16px' gridColumn={{ base: 'auto', lg: 'span 2' }}>
          <VStack align='stretch' spacing={4}>
            <HStack spacing={3} flexWrap='wrap' rowGap={3}>
              <Avatar name={form.name} src={form.avatar} size='lg' />
              <Input size='sm' placeholder='Avatar URL' value={form.avatar} onChange={handle('avatar')} maxW='320px' />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing='12px'>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input size='sm' value={form.name} onChange={handle('name')} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input size='sm' type='email' value={form.email} onChange={handle('email')} />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input size='sm' value={form.phone} onChange={handle('phone')} />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select size='sm' value={form.gender} onChange={handle('gender')}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Designation</FormLabel>
                <Input size='sm' value={form.designation} onChange={handle('designation')} />
              </FormControl>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Input size='sm' value={form.department} onChange={handle('department')} />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Textarea size='sm' rows={3} value={form.address} onChange={handle('address')} />
            </FormControl>

            <HStack spacing={3} flexWrap='wrap' rowGap={3}>
              <FormControl display='flex' alignItems='center' width='auto'>
                <FormLabel htmlFor='twoFA' mb='0'>Enable Two‑Factor</FormLabel>
                <Switch id='twoFA' isChecked={form.twoFA} onChange={(e)=>setForm(s=>({...s, twoFA: e.target.checked}))} />
              </FormControl>
              <Tooltip label='City used for transport and HR processes'>
                <Input size='sm' placeholder='City' value={form.city} onChange={handle('city')} maxW='200px' />
              </Tooltip>
            </HStack>

            <Flex justify='flex-end' gap={2} flexWrap='wrap' rowGap={3}>
              <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={reset}>Reset</Button>
              <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdSave} />} onClick={save}>Save</Button>
            </Flex>
          </VStack>
        </Card>

        <Card p='16px'>
          <VStack spacing={3} align='stretch'>
            <Text fontWeight='700'>Preview</Text>
            <HStack spacing={4}>
              <Avatar name={form.name} src={form.avatar} />
              <VStack spacing={0} align='start'>
                <Text fontWeight='700'>{form.name}</Text>
                <Text fontSize='sm' color={textSecondary}>{form.designation}</Text>
                <Text fontSize='sm' color={textSecondary}>{form.department}</Text>
              </VStack>
            </HStack>
            <VStack spacing={1} align='start' fontSize='sm' color={textSecondary}>
              <Text>{form.email}</Text>
              <Text>{form.phone}</Text>
              <Text>{form.address}</Text>
              <Text>{form.city}</Text>
            </VStack>
          </VStack>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
