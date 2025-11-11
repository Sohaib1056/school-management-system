import React from 'react';
import { Box, Text, Flex, Button, SimpleGrid, Badge, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, InputGroup, InputLeftElement, Select, Avatar, HStack, IconButton, Progress } from '@chakra-ui/react';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';
// Icons
import { MdSchool, MdGrade, MdStar, MdStarBorder, MdTrendingUp, MdSearch, MdFilterList, MdRemoveRedEye, MdMoreVert, MdAssignment } from 'react-icons/md';
// Mock data
import { mockStudents, mockExamResults } from '../../../../utils/mockData';

export default function StudentPerformancePage() {
  // In a real app, this would fetch data from an API
  const students = mockStudents;

  // Generate mock performance data
  const studentsWithPerformance = students.map(student => {
    const gpa = (3 + Math.random()).toFixed(2);
    const percentage = Math.floor(70 + Math.random() * 25);
    const rank = Math.floor(1 + Math.random() * 10);
    
    return {
      ...student,
      gpa,
      percentage,
      rank,
      grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : 'C',
    };
  });

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Page Header */}
      <Flex justify='space-between' align='center' mb='20px'>
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            Student Performance
          </Text>
          <Text fontSize='md' color='gray.500'>
            Analyze academic performance and results
          </Text>
        </Box>
        <Button colorScheme='blue' leftIcon={<MdAssignment />}>
          Generate Reports
        </Button>
      </Flex>

      {/* Performance Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<MdSchool w='28px' h='28px' color='white' />}
            />
          }
          name='Class Average'
          value='82.5%'
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #01B574 0%, #51CB97 100%)'
              icon={<MdGrade w='28px' h='28px' color='white' />}
            />
          }
          name='Average GPA'
          value='3.75'
          endContent={
            <Badge colorScheme='green' fontSize='sm' mt='10px'>
              Above Target
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #FFB36D 0%, #FD7853 100%)'
              icon={<MdStar w='28px' h='28px' color='white' />}
            />
          }
          name='Top Performer'
          value='96.7%'
          endContent={
            <Badge colorScheme='purple' fontSize='sm' mt='10px'>
              Ali Khan
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #8952FF 0%, #AA80FF 100%)'
              icon={<MdTrendingUp w='28px' h='28px' color='white' />}
            />
          }
          name='Class Progress'
          value='+8.5%'
          endContent={
            <Badge colorScheme='blue' fontSize='sm' mt='10px'>
              vs. Last Term
            </Badge>
          }
        />
      </SimpleGrid>

      {/* Latest Exam Results */}
      <Card p='20px' mb='20px'>
        <Text fontSize='lg' fontWeight='bold' mb='15px'>
          Latest Exam Results
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap='20px'>
          {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map((subject, index) => {
            const score = 70 + Math.floor(Math.random() * 30);
            return (
            <Card key={subject} variant='outline'>
              <Flex p='15px' direction='column'>
                <Text fontWeight='bold'>{subject}</Text>
                <Text fontSize='2xl' fontWeight='bold' mt='10px'>{score}%</Text>
                <Progress value={score} colorScheme={score >= 90 ? 'green' : score >= 70 ? 'blue' : 'orange'} size='sm' mt='10px' />
                <Badge alignSelf='flex-start' mt='10px' colorScheme={score >= 90 ? 'green' : score >= 70 ? 'blue' : 'orange'}>
                  {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Average'}
                </Badge>
              </Flex>
            </Card>
            );
          })}
        </SimpleGrid>
      </Card>

      {/* Search and Filter Section */}
      <Card p='20px' mb='20px'>
        <Flex gap='10px' flexWrap='wrap'>
          <InputGroup w={{ base: '100%', md: '300px' }}>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder='Search by name, ID, or class...'
            />
          </InputGroup>
          
          <Select
            w={{ base: '100%', md: '150px' }}
            icon={<MdFilterList />}
            defaultValue='all'
          >
            <option value='all'>All Classes</option>
            <option value='9'>Class 9</option>
            <option value='10'>Class 10</option>
            <option value='11'>Class 11</option>
            <option value='12'>Class 12</option>
          </Select>
          
          <Select
            w={{ base: '100%', md: '150px' }}
            icon={<MdFilterList />}
            defaultValue='all'
          >
            <option value='all'>All Grades</option>
            <option value='A+'>A+</option>
            <option value='A'>A</option>
            <option value='B+'>B+</option>
            <option value='B'>B</option>
            <option value='C'>C or below</option>
          </Select>
        </Flex>
      </Card>

      {/* Students Performance Table */}
      <Card p='20px'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>STUDENT</Th>
                <Th>ROLL NO.</Th>
                <Th>CLASS</Th>
                <Th>PERCENTAGE</Th>
                <Th>GPA</Th>
                <Th>GRADE</Th>
                <Th>RANK</Th>
                <Th>ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {studentsWithPerformance.map((student) => (
                <Tr key={student.id}>
                  <Td>
                    <HStack spacing='12px'>
                      <Avatar
                        size='sm'
                        name={student.name}
                        src={student.avatar}
                      />
                      <Text fontWeight='500'>{student.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize='sm'>{student.rollNumber}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme='purple'>
                      {student.class}-{student.section}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize='sm' fontWeight='500'>{student.percentage}%</Text>
                    <Progress value={student.percentage} colorScheme={
                      student.percentage >= 90 ? 'green' : 
                      student.percentage >= 70 ? 'blue' : 
                      'orange'
                    } size='xs' w='100px' />
                  </Td>
                  <Td>
                    <Text fontSize='sm' fontWeight='500'>{student.gpa}</Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        student.grade === 'A+' ? 'green' :
                        student.grade === 'A' ? 'teal' :
                        student.grade === 'B+' ? 'blue' :
                        student.grade === 'B' ? 'cyan' : 'orange'
                      }
                    >
                      {student.grade}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize='sm' fontWeight='500'>#{student.rank}</Text>
                  </Td>
                  <Td>
                    <HStack spacing='2'>
                      <IconButton
                        aria-label='View details'
                        icon={<MdRemoveRedEye />}
                        size='sm'
                        variant='ghost'
                        colorScheme='blue'
                      />
                      <IconButton
                        aria-label='More options'
                        icon={<MdMoreVert />}
                        size='sm'
                        variant='ghost'
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
