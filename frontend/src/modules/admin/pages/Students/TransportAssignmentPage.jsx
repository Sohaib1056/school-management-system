import React from 'react';
import { Box, Text, Flex, Button, SimpleGrid, Badge, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, InputGroup, InputLeftElement, Select, Avatar, HStack, IconButton } from '@chakra-ui/react';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';
// Icons
import { MdDirectionsBus, MdCreditCard, MdLocationOn, MdPerson, MdSearch, MdFilterList, MdRemoveRedEye, MdMoreVert, MdMap } from 'react-icons/md';
// Mock data
import { mockStudents } from '../../../../utils/mockData';

export default function TransportAssignmentPage() {
  // In a real app, this would fetch data from an API
  const students = mockStudents;

  // Generate mock transport data
  const studentsWithTransport = students.map(student => ({
    ...student,
    busNumber: student.id % 4 !== 0 ? `10${student.id % 3 + 1}` : null,
    rfidStatus: student.id % 4 !== 0 ? (student.id % 5 === 0 ? 'inactive' : 'active') : null,
    pickupStop: student.id % 4 !== 0 ? 'Model Town Stop' : null,
    transportAssigned: student.id % 4 !== 0,
  }));

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Page Header */}
      <Flex justify='space-between' align='center' mb='20px'>
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            Transport Assignment
          </Text>
          <Text fontSize='md' color='gray.500'>
            Manage student transport and bus assignments
          </Text>
        </Box>
        <Button colorScheme='blue' leftIcon={<MdMap />}>
          View Route Map
        </Button>
      </Flex>

      {/* Transport Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<MdDirectionsBus w='28px' h='28px' color='white' />}
            />
          }
          name='Total Buses'
          value='12'
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #01B574 0%, #51CB97 100%)'
              icon={<MdPerson w='28px' h='28px' color='white' />}
            />
          }
          name='Bus Users'
          value='845'
          endContent={
            <Badge colorScheme='green' fontSize='sm' mt='10px'>
              67.6% of students
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #FFB36D 0%, #FD7853 100%)'
              icon={<MdCreditCard w='28px' h='28px' color='white' />}
            />
          }
          name='Active RFID Cards'
          value='825'
          endContent={
            <Badge colorScheme='purple' fontSize='sm' mt='10px'>
              97.6% of bus users
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #E31A1A 0%, #FF8080 100%)'
              icon={<MdLocationOn w='28px' h='28px' color='white' />}
            />
          }
          name='Routes'
          value='5'
          endContent={
            <Badge colorScheme='blue' fontSize='sm' mt='10px'>
              Active Routes
            </Badge>
          }
        />
      </SimpleGrid>

      {/* Available Buses */}
      <Card p='20px' mb='20px'>
        <Text fontSize='lg' fontWeight='bold' mb='15px'>
          Available Buses
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
          {[1, 2, 3].map((bus) => (
            <Card key={bus} variant='outline'>
              <Flex p='15px' justify='space-between' align='center'>
                <Box>
                  <Text fontWeight='bold'>Bus 10{bus}</Text>
                  <Text fontSize='sm' color='gray.500'>Main Route {String.fromCharCode(64 + bus)}</Text>
                  <HStack mt='5px' spacing='5px'>
                    <Badge colorScheme='green'>{5 + bus} seats available</Badge>
                  </HStack>
                </Box>
                <IconButton 
                  icon={<MdDirectionsBus />} 
                  colorScheme='blue' 
                  size='sm' 
                  aria-label='View bus details' 
                />
              </Flex>
            </Card>
          ))}
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
              placeholder='Search by name, ID, or bus...'
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
            <option value='all'>All Buses</option>
            <option value='101'>Bus 101</option>
            <option value='102'>Bus 102</option>
            <option value='103'>Bus 103</option>
            <option value='none'>Not Assigned</option>
          </Select>
        </Flex>
      </Card>

      {/* Students Transport Table */}
      <Card p='20px'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>STUDENT</Th>
                <Th>ROLL NO.</Th>
                <Th>CLASS</Th>
                <Th>BUS NUMBER</Th>
                <Th>PICKUP POINT</Th>
                <Th>RFID STATUS</Th>
                <Th>ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {studentsWithTransport.map((student) => (
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
                    {student.busNumber ? (
                      <Badge colorScheme='blue'>{student.busNumber}</Badge>
                    ) : (
                      <Badge colorScheme='gray'>Not Assigned</Badge>
                    )}
                  </Td>
                  <Td>
                    <Text fontSize='sm'>{student.pickupStop || 'N/A'}</Text>
                  </Td>
                  <Td>
                    {student.rfidStatus ? (
                      <Badge
                        colorScheme={student.rfidStatus === 'active' ? 'green' : 'orange'}
                      >
                        {student.rfidStatus.toUpperCase()}
                      </Badge>
                    ) : (
                      <Badge colorScheme='gray'>N/A</Badge>
                    )}
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
