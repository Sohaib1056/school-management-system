import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, Avatar, HStack, Badge, Icon, useColorModeValue, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import Card from '../../../components/card/Card';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';
import { mockTeachers, mockTodayClasses } from '../../../utils/mockData';
import BarChart from '../../../components/charts/BarChart';

export default function SubjectTeachers() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  const myClass = useMemo(() => {
    const counts = {};
    (mockTodayClasses||[]).forEach(c=>{ counts[c.className] = (counts[c.className]||0)+1; });
    const entry = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    return entry ? entry[0] : '10A';
  }, []);

  const items = useMemo(() => {
    const list = mockTeachers.filter(t => Array.isArray(t.classes) && t.classes.includes(myClass));
    return list.map(t => ({
      name: t.name,
      subject: t.subject,
      email: t.email,
      phone: t.phone,
      avatar: t.avatar,
      classes: t.classes,
      exp: t.experience,
    }));
  }, [myClass]);

  const chartData = useMemo(() => ([{
    name: 'Sessions/Month',
    data: items.map((_, i) => 4 + (i % 5)),
  }]), [items]);
  const chartOptions = useMemo(() => ({
    xaxis: { categories: items.map(t => t.subject) },
    colors: ['#805AD5'],
    dataLabels: { enabled: false },
  }), [items]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Subject Teachers</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Teachers assigned to {myClass}</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Total Teachers</Text>
            <Text fontSize='3xl' fontWeight='800'>{items.length}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Subjects</Text>
            <Text fontSize='3xl' fontWeight='800'>{new Set(items.map(t => t.subject)).size}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Class</Text>
            <Text fontSize='3xl' fontWeight='800'>{myClass}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing='16px'>
        {items.map((t, i) => (
          <Card key={i} p='16px'>
            <HStack spacing={4} align='start' flexWrap='wrap' rowGap={3}>
              <Avatar name={t.name} src={t.avatar} />
              <VStack spacing={1} align='start' w='full'>
                <HStack justify='space-between' w='full'>
                  <HStack><Icon as={MdPerson} /><Text fontWeight='700'>{t.name}</Text></HStack>
                  <Badge colorScheme='blue'>{t.subject}</Badge>
                </HStack>
                <Text fontSize='sm' color={textSecondary}>Exp: {t.exp}</Text>
                <HStack spacing={3} color={textSecondary} fontSize='sm' flexWrap='wrap' rowGap={1}>
                  <HStack><Icon as={MdEmail} /><Text>{t.email}</Text></HStack>
                  <HStack><Icon as={MdPhone} /><Text>{t.phone}</Text></HStack>
                </HStack>
                <Button size='sm' alignSelf='flex-start' mt={2} colorScheme='purple' onClick={() => { setSelected(t); onOpen(); }}>View</Button>
              </VStack>
            </HStack>
          </Card>
        ))}
      </SimpleGrid>

      <Card p='16px' mt='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Monthly Sessions by Subject</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={240} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Teacher Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text><b>Name:</b> {selected.name}</Text>
                <Text><b>Subject:</b> {selected.subject}</Text>
                <Text><b>Email:</b> {selected.email}</Text>
                <Text><b>Phone:</b> {selected.phone}</Text>
                <Text><b>Office Hour:</b> Wed 01:30 PM - 02:00 PM</Text>
                <Badge colorScheme='green'>Hardcoded Demo</Badge>
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
