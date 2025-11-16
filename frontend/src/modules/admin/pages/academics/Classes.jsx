import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  ButtonGroup,
  Badge,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdClass, MdPeople, MdTrendingUp, MdSchool, MdSearch, MdAssignment, MdFileDownload, MdPictureAsPdf, MdRefresh, MdRemoveRedEye, MdEdit } from 'react-icons/md';

const mockClasses = [
  { id: 1, name: 'Class 1', section: 'A', strength: 28, classTeacher: 'Ali Khan' },
  { id: 2, name: 'Class 1', section: 'B', strength: 26, classTeacher: 'Sara Ahmed' },
  { id: 3, name: 'Class 2', section: 'A', strength: 30, classTeacher: 'Hassan Raza' },
  { id: 4, name: 'Class 2', section: 'B', strength: 27, classTeacher: 'Amna Tariq' },
  { id: 5, name: 'Class 3', section: 'A', strength: 24, classTeacher: 'Nida Noor' },
  { id: 6, name: 'Class 3', section: 'B', strength: 25, classTeacher: 'Hamza Iqbal' },
  { id: 7, name: 'Class 4', section: 'A', strength: 29, classTeacher: 'Usman Ali' },
  { id: 8, name: 'Class 5', section: 'A', strength: 31, classTeacher: 'Shazia Parveen' },
];

export default function Classes() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState(mockClasses);
  const [selected, setSelected] = useState(null);
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [form, setForm] = useState({ classTeacher: '', strength: 0 });
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const classes = useMemo(() => {
    const base = filter === 'All' ? rows : rows.filter((c) => c.name === filter);
    const term = search.trim().toLowerCase();
    if (!term) return base;
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.section.toLowerCase().includes(term) ||
        c.classTeacher.toLowerCase().includes(term)
    );
  }, [rows, filter, search]);

  const classNames = useMemo(
    () => ['All', ...Array.from(new Set(mockClasses.map((c) => c.name)))],
    []
  );

  const totalClasses = useMemo(() => new Set(rows.map((c) => c.name)).size, [rows]);
  const totalSections = rows.length;
  const totalStudents = rows.reduce((a, b) => a + b.strength, 0);
  const avgStrength = Math.round(totalStudents / totalSections);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Classes</Heading>
          <Text color={textColorSecondary}>Manage classes, sections and class teachers</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdRefresh />} variant='outline' onClick={()=>window.location.reload()}>Refresh</Button>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdClass color="white" />} />}
          name="Total Classes"
          value={String(totalClasses)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdPeople color="white" />} />}
          name="Sections"
          value={String(totalSections)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdSchool color="white" />} />}
          name="Students"
          value={String(totalStudents)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Avg Strength"
          value={`${avgStrength}`}
        />
      </SimpleGrid>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="200px" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {classNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
            <InputGroup w={{ base: '100%', md: '260px' }}>
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search section/teacher" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </InputGroup>
          </HStack>
          <HStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue">Add Class</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Classes Overview
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th>Section</Th>
                <Th>Strength</Th>
                <Th>Class Teacher</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classes.map((c) => (
                <Tr key={`${c.name}-${c.section}`}>
                  <Td>{c.name}</Td>
                  <Td>{c.section}</Td>
                  <Td>{c.strength}</Td>
                  <Td>{c.classTeacher}</Td>
                  <Td>
                    <Badge colorScheme={c.strength >= 30 ? 'orange' : 'green'}>
                      {c.strength >= 30 ? 'Full' : 'Open'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setSelected(c); onViewOpen(); }} />
                      <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setSelected(c); setForm({ classTeacher: c.classTeacher, strength: c.strength }); onEditOpen(); }} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Modal isOpen={isViewOpen} onClose={onViewClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Class Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <Box>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <Box><Text fontWeight='600'>Class</Text><Text>{selected.name}</Text></Box>
                  <Box><Text fontWeight='600'>Section</Text><Text>{selected.section}</Text></Box>
                  <Box><Text fontWeight='600'>Strength</Text><Text>{selected.strength}</Text></Box>
                  <Box><Text fontWeight='600'>Class Teacher</Text><Text>{selected.classTeacher}</Text></Box>
                  <Box><Text fontWeight='600'>Status</Text><Badge ml={2} colorScheme={selected.strength >= 30 ? 'orange' : 'green'}>{selected.strength >= 30 ? 'Full' : 'Open'}</Badge></Box>
                </SimpleGrid>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onViewClose}>Close</Button>
            <Button colorScheme='blue' variant='outline' onClick={()=>{ onViewClose(); if(selected) { setForm({ classTeacher: selected.classTeacher, strength: selected.strength }); onEditOpen(); }}}>Edit</Button>
            <Button colorScheme='blue' ml={2} onClick={()=>navigate('/admin/students/list')}>Open Students</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <Box>
                <FormControl mb={3}>
                  <FormLabel>Class Teacher</FormLabel>
                  <Input value={form.classTeacher} onChange={(e)=>setForm((f)=>({ ...f, classTeacher: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel>Strength</FormLabel>
                  <Input type='number' value={form.strength} onChange={(e)=>setForm((f)=>({ ...f, strength: Number(e.target.value)||0 }))} />
                </FormControl>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onEditClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{
              if (!selected) { onEditClose(); return; }
              setRows((rs)=> rs.map((r)=> (r.name===selected.name && r.section===selected.section ? { ...r, classTeacher: form.classTeacher, strength: form.strength } : r)));
              onEditClose();
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
