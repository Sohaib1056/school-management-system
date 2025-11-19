import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Select,
  Button,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdPrint, MdVisibility, MdEdit } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { useAuth } from '../../../contexts/AuthContext';

// Sample demo data
const periods = ['08:00', '09:00', '10:00', '11:00', '12:00', '02:00'];
const sampleWeek = {
  '9-A': {
    Mon: {
      '08:00': { subject: 'Mathematics', room: '201', teacher: 'Mr. Ali' },
      '09:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '10:00': { subject: 'Chemistry', room: '305', teacher: 'Mr. Khan' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Physics', room: '302', teacher: 'Mr. Aslam' },
      '02:00': { subject: 'Computer Science', room: 'Lab-1', teacher: 'Ms. Ayesha' },
    },
    Tue: {
      '08:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
      '09:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '10:00': { subject: 'Biology', room: '306', teacher: 'Ms. Hina' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '02:00': { subject: 'Islamiat', room: '105', teacher: 'Mr. Hassan' },
    },
    Wed: {
      '08:00': { subject: 'Mathematics', room: '201', teacher: 'Mr. Ali' },
      '09:00': { subject: 'Computer Science', room: 'Lab-1', teacher: 'Ms. Ayesha' },
      '10:00': { subject: 'Physics', room: '302', teacher: 'Mr. Aslam' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
      '02:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
    },
    Thu: {
      '08:00': { subject: 'Chemistry', room: '305', teacher: 'Mr. Khan' },
      '09:00': { subject: 'Biology', room: '306', teacher: 'Ms. Hina' },
      '10:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Pak Studies', room: '101', teacher: 'Mr. Nadeem' },
      '02:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
    },
    Fri: {
      '08:00': { subject: 'Mathematics', room: '201', teacher: 'Mr. Ali' },
      '09:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
      '10:00': { subject: 'Physics', room: '302', teacher: 'Mr. Aslam' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Computer Science', room: 'Lab-1', teacher: 'Ms. Ayesha' },
      '02:00': { subject: 'Islamiyat', room: '105', teacher: 'Mr. Hassan' },
    },
  },
  '10-A': {
    Mon: {
      '08:00': { subject: 'Chemistry', room: '305', teacher: 'Mr. Khan' },
      '09:00': { subject: 'Biology', room: '306', teacher: 'Ms. Hina' },
      '10:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '02:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
    },
    Tue: {
      '08:00': { subject: 'Physics', room: '302', teacher: 'Mr. Aslam' },
      '09:00': { subject: 'Pak Studies', room: '101', teacher: 'Mr. Nadeem' },
      '10:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Computer Science', room: 'Lab-1', teacher: 'Ms. Ayesha' },
      '02:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
    },
    Wed: {
      '08:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '09:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
      '10:00': { subject: 'Physics', room: '302', teacher: 'Mr. Aslam' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '02:00': { subject: 'Chemistry', room: '305', teacher: 'Mr. Khan' },
    },
    Thu: {
      '08:00': { subject: 'Biology', room: '306', teacher: 'Ms. Hina' },
      '09:00': { subject: 'Pak Studies', room: '101', teacher: 'Mr. Nadeem' },
      '10:00': { subject: 'Computer Science', room: 'Lab-1', teacher: 'Ms. Ayesha' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '02:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
    },
    Fri: {
      '08:00': { subject: 'Math', room: '201', teacher: 'Mr. Ali' },
      '09:00': { subject: 'English', room: '104', teacher: 'Ms. Sara' },
      '10:00': { subject: 'Chemistry', room: '305', teacher: 'Mr. Khan' },
      '11:00': { subject: 'Break', room: '-', teacher: '-' },
      '12:00': { subject: 'Urdu', room: '103', teacher: 'Mr. Imran' },
      '02:00': { subject: 'Biology', room: '306', teacher: 'Ms. Hina' },
    },
  },
};

export default function DailyTimetable() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const { user } = useAuth();

  const [cls, setCls] = useState('9');
  const [section, setSection] = useState('A');
  function toYMD(d) { const x = new Date(d.getTime() - d.getTimezoneOffset()*60000); return x.toISOString().slice(0,10); }
  const [date, setDate] = useState(() => toYMD(new Date()));
  const [viewDate, setViewDate] = useState(() => new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const key = `${cls}-${section}`;
  const dayKey = useMemo(() => {
    const d = new Date(date);
    const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const n = names[d.getDay()] || 'Mon';
    return n;
  }, [date]);
  const teacherTokens = useMemo(() => {
    const raw = (user?.name || '').toLowerCase().replace(/\b(mr\.?|ms\.?|mrs\.?|miss|dr\.?|prof\.?|teacher)\b/g, '').trim();
    const toks = raw.split(/\s+/).filter(Boolean);
    return toks.length ? toks : ['ali'];
  }, [user]);

  // Auto-pick class-section that has this teacher's periods
  useEffect(() => {
    try {
      for (const cs of Object.keys(sampleWeek)) {
        const week = sampleWeek[cs] || {};
        for (const day of Object.keys(week)) {
          const slots = week[day] || {};
          const hasMine = Object.values(slots).some(v => v && (v.subject === 'Break' || (v.teacher && String(v.teacher).toLowerCase().includes(teacherTokens[0]))));
          if (hasMine) {
            const [c, s] = cs.split('-');
            if (c && s) { setCls(c); setSection(s); }
            return;
          }
        }
      }
    } catch {}
  }, [teacherTokens]);

  const isMine = (teacherStr) => {
    if (!teacherStr || teacherStr === '-') return false;
    const s = String(teacherStr).toLowerCase();
    return teacherTokens.some((t) => s.includes(t));
  };

  // Build aggregated map: time -> array of { cs, subject, room, teacher } only for this teacher
  const { dayEntriesByTime, breakTimes } = useMemo(() => {
    const map = {}; periods.forEach(p => { map[p] = []; });
    const breaks = new Set();
    Object.keys(sampleWeek).forEach((cs) => {
      const dayObj = sampleWeek[cs]?.[dayKey] || {};
      periods.forEach((t) => {
        const v = dayObj[t];
        if (!v) return;
        if (v.subject === 'Break') { breaks.add(t); return; }
        if (isMine(v.teacher)) { map[t].push({ cs, subject: v.subject, room: v.room, teacher: v.teacher }); }
      });
    });
    return { dayEntriesByTime: map, breakTimes: breaks };
  }, [dayKey, isMine]);

  const kpis = useMemo(() => {
    let total = 0; const subj = new Set(); let breaks = 0;
    periods.forEach((t) => {
      const arr = dayEntriesByTime[t] || [];
      total += arr.length + (breakTimes.has(t) && arr.length===0 ? 1 : 0);
      arr.forEach(e => subj.add(e.subject));
      if (breakTimes.has(t)) breaks += 1;
    });
    return { total, breaks, subjects: subj.size };
  }, [dayEntriesByTime, breakTimes]);

  const chartData = useMemo(() => ([{ name: 'Lectures', data: periods.map(p => (dayEntriesByTime[p]?.length || 0)) }]), [dayEntriesByTime]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: periods }, dataLabels: { enabled: false }, colors: ['#3182CE'] }), []);

  const rows = useMemo(() => periods.map(p => {
    const arr = dayEntriesByTime[p] || [];
    if (arr.length > 0) {
      const classes = arr.map(e => e.cs).join(', ');
      const subject = arr.length === 1 ? arr[0].subject : 'Multiple';
      const room = arr.length === 1 ? arr[0].room : '-';
      const teacher = arr.length === 1 ? arr[0].teacher : (subject==='Multiple' ? (user?.name || '-') : arr[0].teacher);
      return { time: p, classes, subject, room, teacher };
    }
    if (breakTimes.has(p)) return { time: p, classes: '-', subject: 'Break', room: '-', teacher: '-' };
    return { time: p, classes: '-', subject: '-', room: '-', teacher: '-' };
  }), [dayEntriesByTime, breakTimes, user]);

  const exportCSV = () => {
    const header = ['Date','Time','Class','Subject','Room','Teacher'];
    const data = periods.flatMap(p => {
      const arr = dayEntriesByTime[p] || [];
      if (arr.length > 0) return arr.map(e => [date || 'Today', p, e.cs, e.subject, e.room, e.teacher]);
      if (breakTimes.has(p)) return [[date || 'Today', p, '-', 'Break', '-', '-']];
      return [[date || 'Today', p, '-', '-', '-', '-']];
    });
    const csv = [header, ...data].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'daily_timetable.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const openView = (r) => { setSelectedPeriod(r); onOpen(); };

  const monthYearLabel = useMemo(() => {
    const d = viewDate; const m = d.toLocaleString(undefined, { month: 'long' });
    return `${m} ${d.getFullYear()}`;
  }, [viewDate]);

  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const calendarDays = useMemo(() => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startOffset = (d.getDay() + 6) % 7; // Monday-first
    const first = new Date(d); first.setDate(1 - startOffset);
    return Array.from({ length: 42 }, (_, i) => {
      const x = new Date(first); x.setDate(first.getDate() + i); return x;
    });
  }, [viewDate]);

  const isSameDay = (a, bStr) => {
    const [yy,mm,dd] = bStr.split('-').map(Number);
    return a.getFullYear()===yy && (a.getMonth()+1)===mm && a.getDate()===dd;
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Daily Timetable</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>View and manage today's schedule</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Periods Today</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Breaks</Text><Text fontSize='3xl' fontWeight='800'>{kpis.breaks}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Unique Subjects</Text><Text fontSize='3xl' fontWeight='800'>{kpis.subjects}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' align='center' justify='space-between'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='140px'>
              <option>9</option><option>10</option>
            </Select>
            <Select value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='120px'>
              <option>A</option><option>B</option>
            </Select>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{const t=new Date();setCls('9');setSection('A');setDate(toYMD(t));setViewDate(t);}}>Reset</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='16px' mb='16px'>
        <Flex align='center' justify='space-between' mb='10px'>
          <HStack>
            <Button size='sm' onClick={()=>setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))}>{'<'}</Button>
            <Text fontWeight='600'>{monthYearLabel}</Text>
            <Button size='sm' onClick={()=>setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))}>{'>'}</Button>
          </HStack>
          <Text fontSize='sm' color={textSecondary}>Selected: {date}</Text>
        </Flex>
        <SimpleGrid columns={7} spacing='6px'>
          {weekDays.map(d => (<Box key={d} textAlign='center' fontSize='xs' color={textSecondary}>{d}</Box>))}
          {calendarDays.map((d, idx) => {
            const inMonth = d.getMonth() === viewDate.getMonth();
            const isToday = isSameDay(d, toYMD(new Date()));
            const isSelected = isSameDay(d, date);
            return (
              <Box
                key={idx}
                onClick={()=>{setDate(toYMD(d));}}
                cursor='pointer'
                p='8px'
                textAlign='center'
                borderRadius='8px'
                bg={isSelected ? 'blue.500' : isToday ? 'blue.50' : 'transparent'}
                color={isSelected ? 'white' : inMonth ? undefined : textSecondary}
                borderWidth={isToday && !isSelected ? '1px' : '0px'}
                borderColor={isToday && !isSelected ? 'blue.200' : 'transparent'}
              >
                <Text fontSize='sm'>{d.getDate()}</Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
            <Tr>
              <Th>Time</Th>
              <Th>Class</Th>
              <Th>Subject</Th>
              <Th>Room</Th>
              <Th>Teacher</Th>
              <Th textAlign='right'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.time} _hover={{ bg: hoverBg }}>
                <Td>{r.time}</Td>
                <Td>{r.classes || '-'}</Td>
                <Td><Tooltip label={r.subject}><Box isTruncated maxW='260px'>{r.subject}</Box></Tooltip></Td>
                <Td>{r.room}</Td>
                <Td>{r.teacher}</Td>
                <Td>
                  <HStack justify='flex-end'>
                    <Tooltip label='View'><IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>openView(r)} /></Tooltip>
                    <Tooltip label='Edit'><IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' /></Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
            {rows.length===0 && (
              <Tr><Td colSpan={5}><Box p='12px' textAlign='center' color={textSecondary}>No entries.</Box></Td></Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
        </Box>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Period Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPeriod ? (
              <VStack align='start' spacing={2} fontSize='sm'>
                <HStack><Text fontWeight='600'>Time:</Text><Text>{selectedPeriod.time}</Text></HStack>
                <HStack><Text fontWeight='600'>Subject:</Text><Text>{selectedPeriod.subject}</Text></HStack>
                <HStack><Text fontWeight='600'>Room:</Text><Text>{selectedPeriod.room}</Text></HStack>
                <HStack><Text fontWeight='600'>Teacher:</Text><Text>{selectedPeriod.teacher}</Text></HStack>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
