import React, { useMemo, useState } from 'react';
import {
  Box, Text, Flex, HStack, VStack, SimpleGrid, Input, Select, Textarea, Button,
  useColorModeValue, Icon, useToast, Badge
} from '@chakra-ui/react';
import { MdRefresh, MdSave } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockAssignments } from '../../../utils/mockData';

export default function CreateAssignment() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const toast = useToast();

  const [form, setForm] = useState({
    title: '', subject: '', cls: '', section: '', dueDate: '', description: ''
  });

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const reset = () => setForm({ title: '', subject: '', cls: '', section: '', dueDate: '', description: '' });

  const save = () => {
    if (!form.title || !form.subject || !form.cls || !form.section || !form.dueDate) {
      toast({ title: 'Fill required fields', status: 'warning' });
      return;
    }
    toast({ title: 'Assignment created', description: form.title, status: 'success' });
    reset();
  };

  const kpis = useMemo(() => {
    const total = mockAssignments.length;
    const pending = mockAssignments.filter(a => a.status !== 'graded' && a.status !== 'submitted').length;
    const submitted = mockAssignments.filter(a => a.status === 'submitted').length;
    return { total, pending, submitted };
  }, []);

  const chartData = useMemo(() => ([{ name: 'Assignments', data: [kpis.pending, kpis.submitted, kpis.total] }]), [kpis]);
  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['Pending', 'Submitted', 'Total'] },
    dataLabels: { enabled: false },
    colors: ['#3182CE']
  }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Create Assignment</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Publish new work for your classes</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, pink.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Submitted</Text><Text fontSize='3xl' fontWeight='800'>{kpis.submitted}</Text></VStack>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing='12px'>
          <Input placeholder='Title*' value={form.title} onChange={handle('title')} size='sm' />
          <Select placeholder='Subject*' value={form.subject} onChange={handle('subject')} size='sm'>
            <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>English</option>
          </Select>
          <Select placeholder='Class*' value={form.cls} onChange={handle('cls')} size='sm'>
            <option>7</option><option>8</option><option>9</option><option>10</option>
          </Select>
          <Select placeholder='Section*' value={form.section} onChange={handle('section')} size='sm'>
            <option>A</option><option>B</option>
          </Select>
          <Input type='date' placeholder='Due Date*' value={form.dueDate} onChange={handle('dueDate')} size='sm' />
          <Box>
            <Badge mb={1}>Description</Badge>
            <Textarea placeholder='Instructions' value={form.description} onChange={handle('description')} size='sm' rows={4} />
          </Box>
        </SimpleGrid>
        <Flex justify='flex-end' gap={2} mt={4} flexWrap='wrap'>
          <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={reset}>Reset</Button>
          <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdSave} />} onClick={save}>Save</Button>
        </Flex>
      </Card>

      <Card p='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
        </Box>
      </Card>
    </Box>
  );
}
