import React from 'react';
import { Box, Flex, SimpleGrid, Text, Button, HStack, VStack, Badge, Icon, useColorModeValue } from '@chakra-ui/react';
import Card from '../../components/card/Card';
import MiniStatistics from '../../components/card/MiniStatistics';
import IconBox from '../../components/icons/IconBox';
import { MdClass, MdCheckCircle, MdAssignment, MdOutlineEvent, MdNotificationsActive } from 'react-icons/md';

export default function StudentDashboard() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = {
    todaysClasses: 5,
    attendance: 92,
    pendingAssignments: 2,
    upcomingExams: 1,
    notifications: 3,
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='8px'>Student Dashboard</Text>
      <Text fontSize='md' color={textSecondary} mb='20px'>Your classes, assignments and updates</Text>

      <Box overflowX='auto' mb='20px'>
        <SimpleGrid minChildWidth='220px' spacing='16px'>
          <MiniStatistics
            compact
            startContent={<IconBox w='44px' h='44px' bg='linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)' icon={<Icon as={MdClass} w='22px' h='22px' color='white' />} />}
            name="Today's Classes"
            value={String(stats.todaysClasses)}
            trendData={[2,3,4,5,5]}
            trendColor='#4481EB'
          />
          <MiniStatistics
            compact
            startContent={<IconBox w='44px' h='44px' bg='linear-gradient(90deg,#01B574 0%,#51CB97 100%)' icon={<Icon as={MdCheckCircle} w='22px' h='22px' color='white' />} />}
            name='Attendance %'
            value={`${stats.attendance}%`}
            trendData={[88,90,91,92,92]}
            trendColor='#01B574'
          />
          <MiniStatistics
            compact
            startContent={<IconBox w='44px' h='44px' bg='linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)' icon={<Icon as={MdAssignment} w='22px' h='22px' color='white' />} />}
            name='Pending Assignments'
            value={String(stats.pendingAssignments)}
            trendData={[1,2,2,2,2]}
            trendColor='#FD7853'
          />
          <MiniStatistics
            compact
            startContent={<IconBox w='44px' h='44px' bg='linear-gradient(90deg,#667eea 0%,#764ba2 100%)' icon={<Icon as={MdOutlineEvent} w='22px' h='22px' color='white' />} />}
            name='Upcoming Exams'
            value={String(stats.upcomingExams)}
            trendData={[0,1,1,1,1]}
            trendColor='#667eea'
          />
          <MiniStatistics
            compact
            startContent={<IconBox w='44px' h='44px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdNotificationsActive} w='22px' h='22px' color='white' />} />}
            name='Notifications'
            value={String(stats.notifications)}
            trendData={[1,2,2,3,3]}
            trendColor='#f5576c'
          />
        </SimpleGrid>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='20px'>
        <Card p='20px'>
          <Text fontSize='lg' fontWeight='bold' mb='16px'>Today’s Schedule</Text>
          <VStack align='stretch' spacing={3}>
            <Flex justify='space-between' p='10px' bg={useColorModeValue('gray.50','gray.700')} borderRadius='8px'>
              <Text fontWeight='600'>Math - Algebra</Text>
              <HStack><Badge colorScheme='blue'>08:30</Badge><Badge>Room 201</Badge></HStack>
            </Flex>
            <Flex justify='space-between' p='10px' bg={useColorModeValue('gray.50','gray.700')} borderRadius='8px'>
              <Text fontWeight='600'>Science - Biology</Text>
              <HStack><Badge colorScheme='blue'>10:00</Badge><Badge>Lab 1</Badge></HStack>
            </Flex>
            <Flex justify='space-between' p='10px' bg={useColorModeValue('gray.50','gray.700')} borderRadius='8px'>
              <Text fontWeight='600'>English - Grammar</Text>
              <HStack><Badge colorScheme='blue'>12:00</Badge><Badge>Room 105</Badge></HStack>
            </Flex>
          </VStack>
        </Card>

        <Card p='20px'>
          <Text fontSize='lg' fontWeight='bold' mb='16px'>Quick Actions</Text>
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing='12px'>
            <Button leftIcon={<MdAssignment />} colorScheme='purple' variant='outline'>View Assignments</Button>
            <Button leftIcon={<MdCheckCircle />} colorScheme='green' variant='outline'>Attendance</Button>
            <Button leftIcon={<MdOutlineEvent />} colorScheme='blue' variant='outline'>Exam Timetable</Button>
            <Button leftIcon={<MdNotificationsActive />} colorScheme='gray' variant='outline'>Announcements</Button>
            <Button leftIcon={<MdClass />} colorScheme='teal' variant='outline'>My Classes</Button>
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
