import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, Textarea, FormControl, FormLabel, HStack, Switch } from '@chakra-ui/react';
import { MdEmail, MdSend, MdAttachment, MdCheckCircle, MdReport } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockEmails = [
  { id: 'EM-001', subject: 'Parent Meeting', audience: 'All Parents', sent: 420, opened: 312, bounces: 8, time: '09:00 AM' },
  { id: 'EM-002', subject: 'Fee Reminder', audience: 'Outstanding', sent: 120, opened: 86, bounces: 2, time: '10:20 AM' },
];

export default function SendEmail() {
  const [audience, setAudience] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [track, setTrack] = useState(true);

  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => ({ today: 540, openRate: 74, bounceRate: 1.8, queued: 3 }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Send Email</Heading>
          <Text color={textColorSecondary}>Compose and send emails with tracking</Text>
        </Box>
        <Button leftIcon={<MdSend />} colorScheme='blue'>Send</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Sent Today" value={String(stats.today)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdEmail} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Open Rate" value={`${stats.openRate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdCheckCircle} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Bounce Rate" value={`${stats.bounceRate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdReport} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Queued" value={String(stats.queued)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAttachment} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Audience</FormLabel>
            <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value='all'>All Parents</option>
              <option value='students'>All Students</option>
              <option value='class-10a'>Class 10-A</option>
              <option value='custom'>Custom List</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Subject</FormLabel>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Email subject' />
          </FormControl>
          <FormControl gridColumn={{ md: '1 / span 2' }}>
            <FormLabel>Body</FormLabel>
            <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder='Write email content...' />
          </FormControl>
          <FormControl>
            <FormLabel>Track Opens</FormLabel>
            <HStack>
              <Switch isChecked={track} onChange={(e) => setTrack(e.target.checked)} />
              <Text color={textColorSecondary}>{track ? 'Enabled' : 'Disabled'}</Text>
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Attachment</FormLabel>
            <Button leftIcon={<MdAttachment />}>Upload (mock)</Button>
          </FormControl>
        </SimpleGrid>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>ID</Th>
                <Th>Subject</Th>
                <Th>Audience</Th>
                <Th isNumeric>Sent</Th>
                <Th isNumeric>Opened</Th>
                <Th isNumeric>Bounces</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockEmails.map((e) => (
                <Tr key={e.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{e.id}</Text></Td>
                  <Td>{e.subject}</Td>
                  <Td>{e.audience}</Td>
                  <Td isNumeric>{e.sent}</Td>
                  <Td isNumeric>{e.opened}</Td>
                  <Td isNumeric>{e.bounces}</Td>
                  <Td><Text color={textColorSecondary}>{e.time}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
