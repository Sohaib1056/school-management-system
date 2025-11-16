import React, { useMemo } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { MdSpeed, MdBatteryFull, MdWarning } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const telemetry = [
  { bus: 'BUS-101', avgSpeed: 38, fuel: 9.2, temp: 78, events: 1 },
  { bus: 'BUS-102', avgSpeed: 0, fuel: 0, temp: 0, events: 0 },
  { bus: 'BUS-103', avgSpeed: 32, fuel: 8.7, temp: 82, events: 2 },
];

export default function Telematics() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    const active = telemetry.filter((t) => t.avgSpeed > 0).length;
    const avgSpeed = Math.round(telemetry.reduce((s, t) => s + t.avgSpeed, 0) / telemetry.length);
    const fuel = (telemetry.filter(t => t.fuel>0).reduce((s,t)=> s + t.fuel, 0) / Math.max(1, telemetry.filter(t => t.fuel>0).length)).toFixed(1);
    const alerts = telemetry.reduce((s, t) => s + t.events, 0);
    return { active, avgSpeed, fuel, alerts };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Telematics</Heading>
          <Text color={textColorSecondary}>Vehicle analytics: speed, fuel and events</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Active Buses" value={String(stats.active)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdSpeed} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Avg Speed" value={`${stats.avgSpeed} km/h`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdSpeed} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Fuel Economy" value={`${stats.fuel} km/l`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdBatteryFull} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Alert Events" value={String(stats.alerts)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Bus</Th>
                <Th isNumeric>Avg Speed</Th>
                <Th isNumeric>Fuel (km/l)</Th>
                <Th isNumeric>Engine Temp</Th>
                <Th isNumeric>Events</Th>
              </Tr>
            </Thead>
            <Tbody>
              {telemetry.map((t) => (
                <Tr key={t.bus} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Badge colorScheme='blue'>{t.bus}</Badge></Td>
                  <Td isNumeric>{t.avgSpeed}</Td>
                  <Td isNumeric>{t.fuel}</Td>
                  <Td isNumeric>{t.temp}°C</Td>
                  <Td isNumeric>{t.events}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
