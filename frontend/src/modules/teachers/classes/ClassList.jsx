import React, { useMemo, useState } from 'react';
import { Box, Text, useColorModeValue, Flex, HStack, Select, Input, SimpleGrid, Badge, Table, Thead, Tbody, Tr, Th, Td, Button, Icon, Tag, TagLabel, TagCloseButton, Tooltip, IconButton } from '@chakra-ui/react';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { MdDownload, MdRefresh, MdOpenInNew, MdVisibility, MdEdit } from 'react-icons/md';

const sampleClasses = [
  { id: '7A', className: '7', section: 'A', subject: 'Mathematics', strength: 32, next: '10:30 AM' },
  { id: '7B', className: '7', section: 'B', subject: 'Mathematics', strength: 30, next: '11:30 AM' },
  { id: '8A', className: '8', section: 'A', subject: 'Mathematics', strength: 28, next: '12:30 PM' },
  { id: '9A', className: '9', section: 'A', subject: 'Mathematics', strength: 35, next: '02:00 PM' },
];

export default function ClassList() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7','#2D3748');
  const [q, setQ] = useState('');
  const [grade, setGrade] = useState('');

  const filtered = useMemo(() => {
    return sampleClasses.filter((c) =>
      (!grade || c.className === grade) &&
      (q === '' || `${c.className}${c.section}${c.subject}`.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, grade]);

  const kpis = useMemo(() => {
    const totalStudents = filtered.reduce((acc, c) => acc + c.strength, 0);
    const next = filtered[0]?.next || '-';
    return {
      totalClasses: filtered.length,
      totalStudents,
      nextPeriod: next,
    };
  }, [filtered]);

  const chartData = useMemo(() => ([
    { name: 'Students', data: filtered.map(c => c.strength) }
  ]), [filtered]);

  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: filtered.map(c => `${c.className}${c.section}`) },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor },
    colors: ['#3182CE']
  }), [filtered, gridColor]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Class List</Text>
      <Text fontSize='md' color={textSecondary} mb='18px'>Your assigned classes</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <Text fontSize='sm' opacity={0.9}>Total Classes</Text>
          <Text fontSize='3xl' fontWeight='800'>{kpis.totalClasses}</Text>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <Text fontSize='sm' opacity={0.9}>Total Students</Text>
          <Text fontSize='3xl' fontWeight='800'>{kpis.totalStudents}</Text>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'>
          <Text fontSize='sm' opacity={0.9}>Next Period</Text>
          <Text fontSize='3xl' fontWeight='800'>{kpis.nextPeriod}</Text>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' align='center' justify='space-between'>
          <HStack spacing={3} flexWrap='wrap'>
            <Select value={grade} onChange={(e) => setGrade(e.target.value)} w={{ base: '100%', md: '200px' }} size='sm'>
              <option value=''>All Grades</option>
              <option value='7'>Grade 7</option>
              <option value='8'>Grade 8</option>
              <option value='9'>Grade 9</option>
            </Select>
            <Input placeholder='Search class/section/subject' value={q} onChange={(e)=>setQ(e.target.value)} w={{ base: '100%', md: '260px' }} size='sm' />
          </HStack>
          <HStack spacing={2} flexWrap='wrap'>
            <Button size='sm' leftIcon={<Icon as={MdRefresh} />} variant='outline' onClick={()=>{ setQ(''); setGrade(''); }}>Reset</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdDownload} />} onClick={()=>{
              const rows = filtered.map(c=>({Class:c.className, Section:c.section, Subject:c.subject, Students:c.strength, Next:c.next}));
              const csv = ['Class,Section,Subject,Students,Next', ...rows.map(r=>`${r.Class},${r.Section},${r.Subject},${r.Students},${r.Next}`)].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'classes.csv'; a.click(); URL.revokeObjectURL(url);
            }}>Export CSV</Button>
          </HStack>
        </Flex>
        <HStack spacing={2} mt={3} flexWrap='wrap'>
          {grade && (
            <Tag size='sm' colorScheme='blue' borderRadius='full'>
              <TagLabel>Grade {grade}</TagLabel>
              <TagCloseButton onClick={()=>setGrade('')} />
            </Tag>
          )}
          {q && (
            <Tag size='sm' colorScheme='purple' borderRadius='full'>
              <TagLabel>Search: {q}</TagLabel>
              <TagCloseButton onClick={()=>setQ('')} />
            </Tag>
          )}
        </HStack>
      </Card>

      <Card p='16px' mb='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={320} />
        </Box>
      </Card>

      <Card p='0'>
        <Box overflowX='auto'>
          <Box minW='720px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead bg={headerBg} position='sticky' top={0} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Class</Th>
                  <Th>Section</Th>
                  <Th>Subject</Th>
                  <Th isNumeric>Students</Th>
                  <Th>Next Period</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((c, idx) => (
                  <Tr key={c.id} _hover={{ bg: hoverBg, transform: 'translateY(-1px)' }} transition='all .15s ease'>
                    <Td>{c.className}</Td>
                    <Td>{c.section}</Td>
                    <Td maxW='240px'>
                      <Tooltip label={c.subject} hasArrow>
                        <Box isTruncated>{c.subject}</Box>
                      </Tooltip>
                    </Td>
                    <Td isNumeric>{c.strength}</Td>
                    <Td><Badge colorScheme='blue'>{c.next}</Badge></Td>
                    <Td textAlign='right'>
                      <HStack justify='flex-end' spacing={1}>
                        <Tooltip label='View class'>
                          <IconButton aria-label='View' icon={<Icon as={MdVisibility} />} size='xs' variant='outline' />
                        </Tooltip>
                        <Tooltip label='Edit class'>
                          <IconButton aria-label='Edit' icon={<Icon as={MdEdit} />} size='xs' colorScheme='blue' variant='solid' />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filtered.length === 0 && (
                  <Tr>
                    <Td colSpan={6} textAlign='center' py={8} color={textSecondary}>No classes found.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
