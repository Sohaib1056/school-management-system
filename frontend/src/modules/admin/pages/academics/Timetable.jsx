import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Select,
  Grid,
  GridItem,
  Flex,
  SimpleGrid,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdSchedule, MdAccessTime, MdGridOn, MdAssignment, MdUpdate } from 'react-icons/md';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const sample = {
  'Class 1-A': {
    Monday: ['Eng', 'Math', 'Sci', 'Urdu', 'PE', 'Art'],
    Tuesday: ['Math', 'Eng', 'Sci', 'Isl', 'Comp', 'PE'],
    Wednesday: ['Sci', 'Math', 'Eng', 'Urdu', 'Art', 'Lib'],
    Thursday: ['Isl', 'Eng', 'Math', 'Sci', 'PE', 'Comp'],
    Friday: ['Urdu', 'Sci', 'Math', 'Eng', 'Art', 'PE'],
  },
};

export default function Timetable() {
  const [cls, setCls] = useState('Class 1');
  const [section, setSection] = useState('A');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const key = `${cls}-${section}`;
  const grid = useMemo(() => sample[key] || {}, [key]);
  const totalCells = days.length * periods.length;
  const filledCells = useMemo(() => {
    return days.reduce((acc, d) => acc + (grid[d]?.filter(Boolean).length || 0), 0);
  }, [grid]);
  const freeCells = totalCells - filledCells;
  const uniqueSubjects = useMemo(() => {
    const set = new Set();
    days.forEach((d) => (grid[d] || []).forEach((s) => s && set.add(s)));
    return set.size;
  }, [grid]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Timetable</Heading>
          <Text color={textColorSecondary}>Weekly timetable by class and section</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdSchedule color="white" />} />}
          name="Total Periods"
          value={String(totalCells)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdGridOn color="white" />} />}
          name="Scheduled"
          value={String(filledCells)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdAccessTime color="white" />} />}
          name="Free Slots"
          value={String(freeCells)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdGridOn color="white" />} />}
          name="Subjects"
          value={String(uniqueSubjects)}
        />
      </SimpleGrid>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="160px" value={cls} onChange={(e) => setCls(e.target.value)}>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
            </Select>
            <Select w="100px" value={section} onChange={(e) => setSection(e.target.value)}>
              <option>A</option>
              <option>B</option>
            </Select>
          </HStack>
          <HStack>
            <Button leftIcon={<MdUpdate />} colorScheme="blue">Update Timetable</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          {cls} - Section {section}
        </Heading>
        <Box overflowX="auto">
          <Grid templateColumns={`120px repeat(${periods.length}, 1fr)`} gap={2} p={4}>
            <GridItem />
            {periods.map((p) => (
              <GridItem key={p}>
                <Text fontWeight="600" textAlign="center">{p}</Text>
              </GridItem>
            ))}

            {days.map((d) => (
              <React.Fragment key={d}>
                <GridItem><Text fontWeight="600">{d}</Text></GridItem>
                {periods.map((p, i) => (
                  <GridItem key={`${d}-${p}`}>
                    <Box borderWidth="1px" borderRadius="md" p={3} textAlign="center">
                      <Text>{grid[d]?.[i] || '-'}</Text>
                    </Box>
                  </GridItem>
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}
