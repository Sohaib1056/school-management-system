import React, { useMemo, useState } from 'react';
import { Box, Text, useColorModeValue, Flex, HStack, Select, Input, SimpleGrid, Badge, Avatar, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Divider, Tooltip } from '@chakra-ui/react';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const sampleData = [
  { subject: 'Mathematics', students: [
    { id: 'STU001', name: 'Alice Johnson', className: '7', section: 'A' },
    { id: 'STU002', name: 'Bob Smith', className: '7', section: 'B' },
    { id: 'STU003', name: 'Charlie Brown', className: '8', section: 'A' },
  ]},
  { subject: 'Science', students: [
    { id: 'STU004', name: 'Diana Prince', className: '8', section: 'B' },
    { id: 'STU005', name: 'Eva Martinez', className: '7', section: 'A' },
  ]},
  { subject: 'English', students: [
    { id: 'STU006', name: 'Farhan Ali', className: '9', section: 'A' },
    { id: 'STU007', name: 'Ghulam Raza', className: '9', section: 'B' },
  ]},
];

export default function SubjectWiseStudents() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7','#2D3748');
  const [q, setQ] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const subjects = sampleData.map(s => s.subject);

  const filtered = useMemo(() => {
    const list = subject ? sampleData.filter(s => s.subject === subject) : sampleData;
    return list.map(group => ({
      ...group,
      students: group.students.filter(st =>
        (!grade || st.className === grade) &&
        (q === '' || `${st.name}${st.id}${st.className}${st.section}`.toLowerCase().includes(q.toLowerCase()))
      )
    }));
  }, [q, grade, subject]);

  const stats = useMemo(() => {
    const subjectCount = filtered.filter(g => g.students.length > 0).length;
    const totalStudents = filtered.reduce((a,g)=> a + g.students.length, 0);
    return { subjectCount, totalStudents };
  }, [filtered]);

  const chartData = useMemo(() => ([
    { name: 'Students', data: filtered.map(g => g.students.length) }
  ]), [filtered]);

  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: filtered.map(g => g.subject) },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor },
    colors: ['#3182CE']
  }), [filtered, gridColor]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Subject-wise Students</Text>
      <Text fontSize='md' color={textSecondary} mb='18px'>Students grouped by subject</Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Subjects</Text>
            <Text fontSize='3xl' fontWeight='800'>{stats.subjectCount}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Total Students</Text>
            <Text fontSize='3xl' fontWeight='800'>{stats.totalStudents}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md' display={{ base: 'none', lg: 'block' }}>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Selected Subject</Text>
            <Text fontSize='3xl' fontWeight='800'>{subject || 'All'}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap'>
          <Select value={subject} onChange={(e)=>setSubject(e.target.value)} w={{ base: '100%', md: '200px' }} size='sm'>
            <option value=''>All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={grade} onChange={(e) => setGrade(e.target.value)} w={{ base: '100%', md: '200px' }} size='sm'>
            <option value=''>All Grades</option>
            <option value='7'>Grade 7</option>
            <option value='8'>Grade 8</option>
            <option value='9'>Grade 9</option>
          </Select>
          <Input placeholder='Search student/roll' value={q} onChange={(e)=>setQ(e.target.value)} w={{ base: '100%', md: '260px' }} size='sm' />
        </Flex>
      </Card>

      <Card p='16px' mb='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={320} />
        </Box>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing='16px'>
        {filtered.map(group => (
          <Card key={group.subject} p='16px'>
            <Flex justify='space-between' align='center' mb='10px' gap={3} flexWrap='wrap'>
              <Text fontWeight='700'>{group.subject}</Text>
              <Badge colorScheme='blue'>{group.students.length} students</Badge>
            </Flex>
            <Box overflowX='auto'>
              <Box minW='520px'>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing='8px'>
                  {group.students.map(st => (
                    <Flex key={st.id} p='10px' borderWidth='1px' borderRadius='10px' align='center' gap={3} bg={useColorModeValue('white','gray.700')}
                      _hover={{ boxShadow: 'md', bg: hoverBg }} cursor='pointer' onClick={()=>{ setSelected(st); setOpen(true); }}>
                      <Avatar name={st.name} size='sm' />
                      <VStack align='start' spacing={0} minW={0}>
                        <Tooltip label={st.name}><Text fontWeight='600' isTruncated maxW='220px'>{st.name}</Text></Tooltip>
                        <HStack spacing={2}>
                          <Badge>{st.id}</Badge>
                          <Badge colorScheme='purple'>Class {st.className}-{st.section}</Badge>
                        </HStack>
                      </VStack>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={open} onClose={()=>setOpen(false)} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='stretch' spacing={3}>
                <Flex align='center' gap={3}>
                  <Avatar name={selected.name} />
                  <Box>
                    <Text fontWeight='700'>{selected.name}</Text>
                    <Text fontSize='sm' color={textSecondary}>{selected.id}</Text>
                  </Box>
                </Flex>
                <Divider />
                <HStack spacing={3} flexWrap='wrap'>
                  <Badge colorScheme='purple'>Class {selected.className}-{selected.section}</Badge>
                  <Badge>RFID: N/A</Badge>
                  <Badge colorScheme='green'>Attendance: N/A</Badge>
                </HStack>
                <Box>
                  <Text fontSize='sm' color={textSecondary}>Parent: N/A</Text>
                  <Text fontSize='sm' color={textSecondary}>Contact: N/A</Text>
                </Box>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={()=>setOpen(false)}>Close</Button>
            <Button colorScheme='blue'>Open Profile</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
