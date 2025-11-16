import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Input, Textarea, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { MdCampaign, MdAdd, MdPublic, MdSchedule } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockAnnouncements = [
  { id: 'AN-001', title: 'Sports Day', audience: 'All Students', date: '2025-11-20', status: 'Published' },
  { id: 'AN-002', title: 'PTM Schedule', audience: 'All Parents', date: '2025-11-18', status: 'Draft' },
];

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('all');
  const [body, setBody] = useState('');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => ({ total: 12, published: 8, drafts: 4 }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Announcements</Heading>
          <Text color={textColorSecondary}>Create and publish announcements</Text>
        </Box>
        <Button leftIcon={<MdAdd />} colorScheme='blue'>New</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Total" value={String(stats.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdCampaign} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Published" value={String(stats.published)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdPublic} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Drafts" value={String(stats.drafts)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdSchedule} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Announcement title' />
          </FormControl>
          <FormControl>
            <FormLabel>Audience</FormLabel>
            <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value='all'>All</option>
              <option value='students'>Students</option>
              <option value='parents'>Parents</option>
              <option value='teachers'>Teachers</option>
            </Select>
          </FormControl>
          <FormControl gridColumn={{ md: '1 / span 2' }}>
            <FormLabel>Body</FormLabel>
            <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder='Write announcement...' />
          </FormControl>
          <Flex gap={3} gridColumn={{ md: '1 / span 2' }}>
            <Button colorScheme='blue'>Publish</Button>
            <Button variant='outline'>Save Draft</Button>
          </Flex>
        </SimpleGrid>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Audience</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAnnouncements.map((a) => (
                <Tr key={a.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{a.id}</Text></Td>
                  <Td>{a.title}</Td>
                  <Td>{a.audience}</Td>
                  <Td><Text color={textColorSecondary}>{a.date}</Text></Td>
                  <Td><Badge colorScheme={a.status==='Published'?'green':'yellow'}>{a.status}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
