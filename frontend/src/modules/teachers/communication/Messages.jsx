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
  Avatar,
  Badge,
  useColorModeValue,
  Textarea,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { MdSend, MdRefresh, MdFileDownload, MdPrint, MdSearch } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const seedConversations = [
  { id: 'c1', name: 'Admin Office', last: 'Please share the timetable PDF.', unread: 1, type: 'Admin' },
  { id: 'c2', name: 'Parent: Ali (9-A)', last: 'Thank you!', unread: 0, type: 'Parent' },
  { id: 'c3', name: 'Parent: Sara (10-A)', last: 'Absent today.', unread: 2, type: 'Parent' },
];

const seedMessages = {
  c1: [
    { id: 1, from: 'Admin', text: 'Please share the timetable PDF.', time: '09:05' },
    { id: 2, from: 'You', text: 'Sure, sending now.', time: '09:07' },
  ],
  c2: [
    { id: 1, from: 'Parent', text: 'Thanks for the update.', time: '10:15' },
    { id: 2, from: 'You', text: 'You are welcome.', time: '10:17' },
  ],
  c3: [
    { id: 1, from: 'Parent', text: 'Student will be absent today.', time: '08:30' },
  ],
};

export default function Messages() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [conversations, setConversations] = useState(seedConversations);
  const [activeId, setActiveId] = useState('c1');
  const [messages, setMessages] = useState(seedMessages);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [draft, setDraft] = useState('');

  const activeConv = useMemo(() => conversations.find(c => c.id === activeId) || conversations[0], [conversations, activeId]);
  const filteredConvs = useMemo(() => conversations.filter(c =>
    (filterType === 'All' || c.type === filterType) && (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  ), [conversations, search, filterType]);

  const kpis = useMemo(() => ({
    total: conversations.length,
    unread: conversations.filter(c => c.unread > 0).length,
    today: Object.values(messages).reduce((acc, arr) => acc + arr.filter(() => true).length, 0),
  }), [conversations, messages]);

  const chartData = useMemo(() => ([{ name: 'Msgs', data: [4, 6, 3, 8, 5, 7, 6] }]), []);
  const chartOptions = useMemo(() => ({ xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }, colors: ['#4C51BF'] }), []);

  const reset = () => { setSearch(''); setFilterType('All'); };

  const sendMessage = () => {
    if (!draft.trim() || !activeConv) return;
    setMessages(prev => ({ ...prev, [activeConv.id]: [...(prev[activeConv.id] || []), { id: Date.now(), from: 'You', text: draft.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }));
    setDraft('');
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, last: draft.trim(), unread: 0 } : c));
  };

  const exportCSV = () => {
    const conv = activeConv; const arr = messages[conv.id] || [];
    const header = ['From', 'Time', 'Text'];
    const csv = [header, ...arr.map(m => [m.from, m.time, m.text])]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${conv.name.replace(/\s+/g,'_')}_chat.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Messages</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Chat with admin and parents</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Conversations</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Unread</Text><Text fontSize='3xl' fontWeight='800'>{kpis.unread}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Messages (sample)</Text><Text fontSize='3xl' fontWeight='800'>{kpis.today}</Text></VStack></Card>
      </SimpleGrid>

      <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
        <Card p='12px' w={{ base: '100%', md: '320px' }}>
          <HStack mb='10px' spacing={2}>
            <Icon as={MdSearch} color={textSecondary} />
            <Input placeholder='Search' value={search} onChange={e=>setSearch(e.target.value)} size='sm' />
          </HStack>
          <HStack mb='10px'>
            <Select value={filterType} onChange={e=>setFilterType(e.target.value)} size='sm'>
              <option>All</option>
              <option>Admin</option>
              <option>Parent</option>
            </Select>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={reset}>Reset</Button>
          </HStack>
          <VStack align='stretch' spacing={2} maxH='420px' overflowY='auto' pr='4px'>
            {filteredConvs.map(c => (
              <HStack key={c.id} p='10px' borderRadius='10px' cursor='pointer' bg={c.id===activeId?useColorModeValue('gray.100','whiteAlpha.200'):undefined} _hover={{ bg: hoverBg }} onClick={()=>setActiveId(c.id)}>
                <Avatar name={c.name} size='sm' />
                <Box flex='1'>
                  <Text fontWeight='600' fontSize='sm' noOfLines={1}>{c.name}</Text>
                  <Text fontSize='xs' color={textSecondary} noOfLines={1}>{c.last}</Text>
                </Box>
                {c.unread>0 && <Badge colorScheme='red'>{c.unread}</Badge>}
              </HStack>
            ))}
            {filteredConvs.length===0 && <Box p='8px' textAlign='center' color={textSecondary} fontSize='sm'>No conversations</Box>}
          </VStack>
        </Card>

        <Card p='0' flex='1' display='flex' flexDirection='column'>
          <Flex align='center' justify='space-between' p='12px' borderBottom='1px solid' borderColor={useColorModeValue('gray.200','whiteAlpha.300')}>
            <HStack>
              <Avatar name={activeConv?.name} size='sm' />
              <VStack spacing={0} align='start'>
                <Text fontWeight='600'>{activeConv?.name}</Text>
                <Text fontSize='xs' color={textSecondary}>{activeConv?.type}</Text>
              </VStack>
            </HStack>
            <HStack>
              <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
              <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export</Button>
            </HStack>
          </Flex>

          <VStack align='stretch' spacing={3} flex='1' overflowY='auto' p='12px'>
            {(messages[activeConv?.id]||[]).map(m => (
              <Flex key={m.id} justify={m.from==='You'?'flex-end':'flex-start'}>
                <Box maxW='70%' p='10px' borderRadius='12px' bg={m.from==='You'?useColorModeValue('blue.500','blue.400'):useColorModeValue('gray.100','whiteAlpha.200')} color={m.from==='You'?'white':undefined}>
                  <Text fontSize='sm' whiteSpace='pre-wrap'>{m.text}</Text>
                  <Text fontSize='10px' opacity={0.8} mt='4px' textAlign='right'>{m.time}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>

          <HStack p='12px' borderTop='1px solid' borderColor={useColorModeValue('gray.200','whiteAlpha.300')}>
            <Textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={1} resize='none' placeholder='Type a message…' onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); } }} />
            <IconButton aria-label='Send' icon={<MdSend/>} colorScheme='blue' onClick={sendMessage} />
          </HStack>
        </Card>
      </Flex>

      <Card p='16px' mt='16px'>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>
    </Box>
  );
}
