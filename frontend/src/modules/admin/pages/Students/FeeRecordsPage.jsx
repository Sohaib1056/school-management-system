import React, { useState } from 'react';
import {
  Box, Text, Flex, Button, SimpleGrid, Badge, Table,
  Thead, Tbody, Tr, Th, Td, TableContainer,
  Input, InputGroup, InputLeftElement, Select,
  Avatar, HStack, VStack, useToast, IconButton,
  Accordion, AccordionItem, AccordionButton, 
  AccordionPanel, AccordionIcon, Checkbox,
  FormControl, FormLabel, Stack, Radio, RadioGroup,
  Textarea, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, Alert, AlertIcon, Progress,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
// Custom components
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';
// Icons
import {
  MdAttachMoney, MdCheckCircle, MdAccessTime,
  MdWarning, MdPayment, MdPrint, MdEmail,
  MdFileDownload, MdLocalOffer, MdCalendarMonth,
  MdDirectionsBus, MdReceipt, MdVisibility, MdSearch,
  MdFilterList, MdRemoveRedEye,
} from 'react-icons/md';
// Mock data
import { mockStudents } from '../../../../utils/mockData';

export default function FeeRecordsPage() {
  console.log('FeeRecordsPage component is rendering');
  console.log('mockStudents:', mockStudents);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFees, setSelectedFees] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for a specific student's fee details
  const student = mockStudents && mockStudents.length > 0 ? mockStudents[0] : null; // Using the first student for demo
  
  if (!mockStudents || mockStudents.length === 0) {
    console.error('mockStudents is empty or undefined!');
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Text fontSize='2xl' fontWeight='bold' color='red.500'>
          Error: No student data available
        </Text>
      </Box>
    );
  }
  
  // Calculate totals
  const totalFeeAmount = 85000;
  const totalPaidAmount = 63000;
  const totalPendingAmount = 22000;
  const totalOverdueAmount = 5000;
  
  // Process student list with fee data
  const studentsWithFee = mockStudents.map(student => ({
    ...student,
    feeAmount: 85000,
    paidAmount: student.id % 3 === 0 ? 85000 : student.id % 3 === 1 ? 60000 : 45000,
    status: student.id % 3 === 0 ? 'paid' : student.id % 3 === 1 ? 'pending' : 'overdue',
  }));
  
  // Handle payment modal
  const handleMakePayment = () => {
    onOpen();
    setSelectedFees(['transport', 'exam']);
    setPaymentAmount(20000);
  };
  
  // Handle payment submission
  const handleSubmitPayment = () => {
    toast({
      title: 'Payment recorded successfully',
      description: `Payment of PKR ${paymentAmount.toLocaleString()} has been recorded`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };
  
  // Handle fee selection in payment modal
  const handleFeeSelection = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFees([...selectedFees, value]);
    } else {
      setSelectedFees(selectedFees.filter(fee => fee !== value));
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Page Header */}
      <Flex justify='space-between' align='center' mb='20px'>
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            Fee Records
          </Text>
          <Text fontSize='md' color='gray.500'>
            Manage all student fees and payments
          </Text>
        </Box>
        <Button colorScheme='blue' leftIcon={<MdReceipt />}>
          Generate Fee Reports
        </Button>
      </Flex>

      {/* Fee Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<MdAttachMoney w='28px' h='28px' color='white' />}
            />
          }
          name='Total Fee Collection'
          value='PKR 4,250,000'
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #01B574 0%, #51CB97 100%)'
              icon={<MdCheckCircle w='28px' h='28px' color='white' />}
            />
          }
          name='Collected Amount'
          value='PKR 3,825,000'
          endContent={
            <Badge colorScheme='green' fontSize='sm'>
              90% Collected
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #FFB36D 0%, #FD7853 100%)'
              icon={<MdAccessTime w='28px' h='28px' color='white' />}
            />
          }
          name='Pending Amount'
          value='PKR 425,000'
          endContent={
            <Badge colorScheme='orange' fontSize='sm'>
              10% Pending
            </Badge>
          }
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #E31A1A 0%, #FF8080 100%)'
              icon={<MdWarning w='28px' h='28px' color='white' />}
            />
          }
          name='Overdue Amount'
          value='PKR 125,000'
          endContent={
            <Badge colorScheme='red' fontSize='sm'>
              3% Overdue
            </Badge>
          }
        />
      </SimpleGrid>

      {/* Search and Filter Section */}
      <Card p='20px' mb='20px'>
        <Flex gap='10px' flexWrap='wrap'>
          <InputGroup w={{ base: '100%', md: '300px' }}>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder='Search by name, ID, or class...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          
          <Select
            w={{ base: '100%', md: '150px' }}
            icon={<MdFilterList />}
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value='all'>All Status</option>
            <option value='paid'>Paid</option>
            <option value='pending'>Pending</option>
            <option value='overdue'>Overdue</option>
          </Select>
        </Flex>
      </Card>

      {/* Students Fee Table */}
      <Card p='20px'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>STUDENT</Th>
                <Th>ROLL NO.</Th>
                <Th>CLASS</Th>
                <Th>TOTAL FEE</Th>
                <Th>PAID AMOUNT</Th>
                <Th>STATUS</Th>
                <Th>ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {studentsWithFee.map((student) => (
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
                    <Text fontSize='sm'>PKR {student.feeAmount.toLocaleString()}</Text>
                  </Td>
                  <Td>
                    <Text fontSize='sm'>PKR {student.paidAmount.toLocaleString()}</Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        student.status === 'paid'
                          ? 'green'
                          : student.status === 'pending'
                          ? 'orange'
                          : 'red'
                      }
                    >
                      {student.status.toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing='2'>
                      <IconButton
                        aria-label='View details'
                        icon={<MdRemoveRedEye />}
                        size='sm'
                        variant='ghost'
                        colorScheme='blue'
                        onClick={() => navigate(`/admin/students/fees/${student.id}`)}
                      />
                      <IconButton
                        aria-label='Make payment'
                        icon={<MdPayment />}
                        size='sm'
                        variant='ghost'
                        colorScheme='green'
                        onClick={handleMakePayment}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align='stretch'>
              <FormControl>
                <FormLabel>Select Fees to Pay</FormLabel>
                <Stack>
                  <Checkbox 
                    value='transport' 
                    isChecked={selectedFees.includes('transport')}
                    onChange={handleFeeSelection}
                  >
                    Transport Fee - PKR 15,000
                  </Checkbox>
                  <Checkbox 
                    value='exam' 
                    isChecked={selectedFees.includes('exam')}
                    onChange={handleFeeSelection}
                  >
                    Examination Fee - PKR 5,000 (Overdue)
                  </Checkbox>
                  <Checkbox 
                    value='sports' 
                    isChecked={selectedFees.includes('sports')}
                    onChange={handleFeeSelection}
                  >
                    Sports/Activity Fee - PKR 2,000
                  </Checkbox>
                </Stack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Payment Date</FormLabel>
                <Input type="date" defaultValue={new Date().toISOString().substr(0, 10)} />
              </FormControl>
              
              <FormControl>
                <FormLabel>Payment Method</FormLabel>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <Stack direction='row' flexWrap='wrap'>
                    <Radio value='Cash'>Cash</Radio>
                    <Radio value='Bank Transfer'>Bank Transfer</Radio>
                    <Radio value='Cheque'>Cheque</Radio>
                    <Radio value='Online'>Online</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              
              {paymentMethod === 'Cheque' && (
                <SimpleGrid columns={2} spacing={3}>
                  <FormControl>
                    <FormLabel>Cheque Number</FormLabel>
                    <Input placeholder='Enter cheque number' />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bank Name</FormLabel>
                    <Input placeholder='Enter bank name' />
                  </FormControl>
                </SimpleGrid>
              )}
              
              <FormControl>
                <FormLabel>Amount Received</FormLabel>
                <Input 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Textarea placeholder='Add any notes regarding this payment...' />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSubmitPayment}>
              Save & Print Receipt
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}