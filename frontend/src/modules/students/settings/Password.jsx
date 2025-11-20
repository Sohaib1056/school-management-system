import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Button, Icon, useColorModeValue, FormControl, FormLabel, Input, InputGroup, InputRightElement, Progress, useToast } from '@chakra-ui/react';
import { MdSave, MdRefresh, MdVisibility, MdVisibilityOff, MdSecurity } from 'react-icons/md';
import Card from '../../../components/card/Card';
import { mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function strengthScore(p){
  let s = 0; if (!p) return 0; if (p.length>=8) s++; if (/[A-Z]/.test(p)) s++; if (/[a-z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return Math.min(s,5);
}

export default function Password(){
  const textSecondary = useColorModeValue('gray.600','gray.400');
  const { user } = useAuth();
  const toast = useToast();

  const student = useMemo(()=>{
    if (user?.role==='student'){
      const byEmail = mockStudents.find(s=>s.email?.toLowerCase()===user.email?.toLowerCase());
      if (byEmail) return byEmail;
      const byName = mockStudents.find(s=>s.name?.toLowerCase()===user.name?.toLowerCase());
      if (byName) return byName;
      return { id:999, name:user.name, rollNumber:'STU999', class:'10', section:'A', email:user.email };
    }
    return mockStudents[0];
  },[user]);
  const classSection = `${student.class}${student.section}`;

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const score = strengthScore(next);
  const valid = next && confirm && next===confirm && score>=3;

  const onSave = ()=>{
    if (!valid) { toast({ status:'error', title:'Check password requirements' }); return; }
    toast({ status:'success', title:'Password updated (demo)' });
    setCurrent(''); setNext(''); setConfirm('');
  };

  const onReset = ()=>{ setCurrent(''); setNext(''); setConfirm(''); };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Password</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Security Level</Text><HStack><Icon as={MdSecurity} /><Text fontSize='xl' fontWeight='800'>{['Weak','Weak','Fair','Good','Strong','Strong'][score]}</Text></HStack></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Requirements</Text><Text>8+ chars, upper/lower, number, symbol</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Tip</Text><Text>Use a unique password not used elsewhere.</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px'>
        <SimpleGrid columns={{ base:1, sm:2 }} spacing={4}>
          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input type={show1?'text':'password'} value={current} onChange={e=>setCurrent(e.target.value)} placeholder='Current password' />
              <InputRightElement>
                <Icon as={show1? MdVisibilityOff: MdVisibility} cursor='pointer' onClick={()=>setShow1(!show1)} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input type={show2?'text':'password'} value={next} onChange={e=>setNext(e.target.value)} placeholder='New password' />
              <InputRightElement>
                <Icon as={show2? MdVisibilityOff: MdVisibility} cursor='pointer' onClick={()=>setShow2(!show2)} />
              </InputRightElement>
            </InputGroup>
            <Progress mt={2} value={(score/5)*100} size='sm' colorScheme={score>=4?'green':score>=3?'yellow':'red'} borderRadius='md' />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input type={show3?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder='Confirm password' />
              <InputRightElement>
                <Icon as={show3? MdVisibilityOff: MdVisibility} cursor='pointer' onClick={()=>setShow3(!show3)} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </SimpleGrid>
        <HStack mt={4}>
          <Button colorScheme='purple' leftIcon={<Icon as={MdSave} />} onClick={onSave} isDisabled={!valid}>Update Password</Button>
          <Button variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={onReset}>Reset</Button>
        </HStack>
      </Card>
    </Box>
  );
}
