import React from 'react';
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import Card from '../../components/card/Card';
import MiniStatistics from '../../components/card/MiniStatistics';
import IconBox from '../../components/icons/IconBox';
import {
  MdClass,
  MdAssignmentTurnedIn,
  MdCheckCircle,
  MdMessage,
  MdSchedule,
  MdAssignment,
  MdCampaign,
  MdPeople,
  MdBarChart,
} from 'react-icons/md';
import { mockTodayClasses, mockAssignments } from '../../utils/mockData';

export default function TeacherDashboard() {
  const todayClassCount = mockTodayClasses.length;
  const pendingToReview = mockAssignments.filter(a => a.status === 'pending').length;
  const attendanceToTake = todayClassCount; // assuming attendance per class
  const messages = 4; // placeholder

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='10px'>
        Teacher Dashboard
      </Text>
      <Text fontSize='md' color='gray.500' mb='20px'>
        Welcome back! Here is your teaching overview for today.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdClass} color='white' />} />
          }
          name="Today's Classes"
          value={todayClassCount}
          growth='+1'
        />
        <MiniStatistics
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 100%)'
              icon={<Icon w='28px' h='28px' as={MdAssignmentTurnedIn} color='white' />} />
          }
          name='Pending Reviews'
          value={pendingToReview}
          growth='—'
        />
        <MiniStatistics
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg, #00F260 0%, #0575E6 100%)'
              icon={<Icon w='28px' h='28px' as={MdCheckCircle} color='white' />} />
          }
          name='Attendance to Take'
          value={attendanceToTake}
        />
        <MiniStatistics
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg, #A18CD1 0%, #FBC2EB 100%)'
              icon={<Icon w='28px' h='28px' as={MdMessage} color='white' />} />
          }
          name='New Messages'
          value={messages}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap='20px' mb='20px'>
        {/* Left: Today's Schedule */}
        <Card p='20px'>
          <Flex justify='space-between' align='center' mb='16px'>
            <Text fontSize='lg' fontWeight='bold'>Today's Schedule</Text>
            <Badge colorScheme='green'>On Campus</Badge>
          </Flex>
          <VStack align='stretch' spacing='12px'>
            {mockTodayClasses.map((cls) => (
              <Flex key={cls.id} p='12px' bg='gray.50' borderRadius='8px' justify='space-between' align='center'>
                <HStack>
                  <Icon as={MdSchedule} color='blue.500' />
                  <Box>
                    <Text fontWeight='600' fontSize='sm'>{cls.time} • {cls.subject} • {cls.className}</Text>
                    <Text fontSize='xs' color='gray.500'>Room {cls.room} • {cls.topic}</Text>
                  </Box>
                </HStack>
                <Badge colorScheme='blue'>{cls.studentCount} students</Badge>
              </Flex>
            ))}
          </VStack>
          <Button mt='12px' w='100%' variant='outline' colorScheme='blue'>View Full Schedule</Button>
        </Card>

        {/* Right: Quick Actions */}
        <Card p='20px'>
          <Text fontSize='lg' fontWeight='bold' mb='16px'>Quick Actions</Text>
          <VStack spacing='12px'>
            <Button leftIcon={<MdCheckCircle />} w='100%' colorScheme='green'>Mark Attendance</Button>
            <Button leftIcon={<MdAssignment />} w='100%' colorScheme='blue' variant='outline'>Assign Homework</Button>
            <Button leftIcon={<MdCampaign />} w='100%' colorScheme='purple' variant='outline'>Create Announcement</Button>
            <Button leftIcon={<MdSchedule />} w='100%' colorScheme='orange' variant='outline'>View Timetable</Button>
            <Button leftIcon={<MdPeople />} w='100%' colorScheme='teal' variant='outline'>My Classes</Button>
          </VStack>
        </Card>
      </SimpleGrid>

      {/* Assignments to Grade */}
      <Card p='20px'>
        <Flex justify='space-between' align='center' mb='16px'>
          <Text fontSize='lg' fontWeight='bold'>Assignments to Review</Text>
          <Icon as={MdBarChart} color='gray.500' />
        </Flex>
        <VStack align='stretch' spacing='12px'>
          {mockAssignments.filter(a => a.status === 'pending').slice(0, 4).map(a => (
            <Flex key={a.id} p='12px' bg='gray.50' borderRadius='8px' justify='space-between' align='center'>
              <Box>
                <Text fontWeight='600' fontSize='sm'>{a.title} • {a.subject}</Text>
                <Text fontSize='xs' color='gray.500'>Due: {a.dueDate}</Text>
              </Box>
              <Badge colorScheme='orange'>Pending</Badge>
            </Flex>
          ))}
        </VStack>
        <Button mt='12px' w='100%' variant='outline' colorScheme='purple'>View All Assignments</Button>
      </Card>
    </Box>
  );
}
