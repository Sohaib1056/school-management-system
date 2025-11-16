import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';
import { MdWhatshot, MdCalendarToday, MdThumbUp } from 'react-icons/md';

const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const periods = Array.from({ length: 8 }, (_, i) => `P${i+1}`);

const heat = [
  [95, 92, 88, 90, 93, 80, 0, 0],
  [94, 90, 89, 91, 92, 78, 0, 0],
  [93, 89, 90, 92, 91, 76, 0, 0],
  [96, 94, 92, 95, 93, 82, 0, 0],
  [97, 95, 94, 96, 94, 84, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export default function AttendanceHeatmaps() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const getColor = (val) => {
    if (val === 0) return useColorModeValue('#EDF2F7', '#2D3748');
    if (val >= 95) return '#38A169';
    if (val >= 90) return '#D69E2E';
    return '#E53E3E';
  };

  const peak = { day: 'Fri', period: 'P4', rate: 96 };
  const best = { day: 'Mon', rate: 97 };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Attendance Heatmaps</Heading>
          <Text color={textColorSecondary}>Visualize attendance concentration by day and period</Text>
        </Box>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics
          name="Peak Attendance"
          value={`${peak.rate}% (${peak.day} - ${peak.period})`}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00b09b 0%,#96c93d 100%)' icon={<MdWhatshot size={28} color='white' />} />}
        />
        <MiniStatistics
          name="Best Day"
          value={`${best.day} (${best.rate}%)`}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#667eea 0%,#764ba2 100%)' icon={<MdThumbUp size={28} color='white' />} />}
        />
        <MiniStatistics
          name="School Days"
          value={'Mon-Fri'}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<MdCalendarToday size={28} color='white' />} />}
        />
      </SimpleGrid>

      {/* Heatmap */}
      <Card p={4}>
        <SimpleGrid columns={periods.length + 1} spacing={2}>
          <Box />
          {periods.map((p) => (
            <Box key={p} textAlign='center' fontWeight='600'>{p}</Box>
          ))}
          {days.map((d, i) => (
            <React.Fragment key={d}>
              <Box fontWeight='600'>{d}</Box>
              {heat[i].map((v, j) => (
                <Box key={`${i}-${j}`} h='40px' borderRadius='md' bg={getColor(v)} display='flex' alignItems='center' justifyContent='center' color='white' fontWeight='700'>
                  {v ? `${v}%` : '-'}
                </Box>
              ))}
            </React.Fragment>
          ))}
        </SimpleGrid>
        <Flex mt={4} gap={4} align='center'>
          <Text fontSize='sm' color={textColorSecondary}>Legend:</Text>
          <Badge colorScheme='green'>{'>=95%'}</Badge>
          <Badge colorScheme='yellow'>90-94%</Badge>
          <Badge colorScheme='red'>{'< 90%'}</Badge>
        </Flex>
      </Card>
    </Box>
  );
}
