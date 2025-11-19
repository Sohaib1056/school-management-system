import React from 'react';
import { Box, Flex, SimpleGrid, Text, Button, HStack, VStack, Badge, Icon, useColorModeValue } from '@chakra-ui/react';
import Card from '../../components/card/Card';
import IconBox from '../../components/icons/IconBox';
import { MdHome, MdMap, MdGpsFixed, MdPlace, MdDirectionsBus, MdAccessTime, MdReportProblem, MdPlayArrow, MdStop } from 'react-icons/md';

export default function DriverDashboard() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const subtle = useColorModeValue('gray.50', 'gray.700');

  const data = {
    routeName: 'Route A - North Loop',
    stops: 18,
    progress: 62, // percent
    gpsStatus: 'Connected',
    nextStop: 'Stop #7 - Oak Street',
    eta: '08:42 AM',
    vehicleId: 'BUS-12',
    capacity: '48 seats',
    shift: { start: '07:30 AM', end: '02:30 PM' },
    lastUpdate: '1 min ago',
    speed: '36 km/h',
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='8px'>Driver Dashboard</Text>
      <Text fontSize='md' color={textSecondary} mb='20px'>Your route, vehicle and shift at a glance</Text>

      {/* Top KPIs */}
      <Box overflowX='auto' mb='20px'>
        <SimpleGrid minChildWidth='220px' spacing='16px'>
          <Card p='16px'>
            <Flex align='start' justify='space-between' flexWrap='wrap' columnGap={3} rowGap={2}>
              <HStack spacing={3} align='start'>
                <IconBox w='44px' h='44px' bg='linear-gradient(90deg,#00b09b 0%,#96c93d 100%)' icon={<Icon as={MdMap} w='22px' h='22px' color='white' />} />
                <Box>
                  <Text fontWeight='600'>Today’s Route</Text>
                  <Text fontSize='sm' color={textSecondary}>{data.routeName}</Text>
                </Box>
              </HStack>
              <Badge colorScheme='blue' whiteSpace='nowrap' alignSelf='center' size='sm'>{data.stops} stops</Badge>
            </Flex>
            <Box mt='10px' h='8px' bg={useColorModeValue('gray.200','gray.600')} borderRadius='full'>
              <Box h='100%' w={`${data.progress}%`} bg='blue.400' borderRadius='full' />
            </Box>
          </Card>

          <Card p='16px'>
            <Flex align='start' justify='space-between' flexWrap='wrap' columnGap={3} rowGap={2}>
              <HStack spacing={3} align='start'>
                <IconBox w='44px' h='44px' bg='linear-gradient(90deg,#667eea 0%,#764ba2 100%)' icon={<Icon as={MdGpsFixed} w='22px' h='22px' color='white' />} />
                <Box>
                  <Text fontWeight='600'>Live Location</Text>
                  <Text fontSize='sm' color={textSecondary}>GPS: {data.gpsStatus}</Text>
                </Box>
              </HStack>
              <Badge whiteSpace='nowrap' alignSelf='center' size='sm'>{data.speed}</Badge>
            </Flex>
            <Text fontSize='sm' color={textSecondary} mt='8px'>Last update {data.lastUpdate}</Text>
          </Card>

          <Card p='16px'>
            <Flex align='start' justify='space-between' flexWrap='wrap' columnGap={3} rowGap={2}>
              <HStack spacing={3} align='start'>
                <IconBox w='44px' h='44px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdPlace} w='22px' h='22px' color='white' />} />
                <Box>
                  <Text fontWeight='600'>Next Pickup/Drop</Text>
                  <Text fontSize='sm' color={textSecondary}>{data.nextStop}</Text>
                </Box>
              </HStack>
              <Badge colorScheme='blue' whiteSpace='nowrap' alignSelf='center' size='sm'>ETA {data.eta}</Badge>
            </Flex>
          </Card>

          <Card p='16px'>
            <Flex align='start' justify='space-between' flexWrap='wrap' columnGap={3} rowGap={2}>
              <HStack spacing={3} align='start'>
                <IconBox w='44px' h='44px' bg='linear-gradient(90deg,#00C6FB 0%,#005BEA 100%)' icon={<Icon as={MdDirectionsBus} w='22px' h='22px' color='white' />} />
                <Box>
                  <Text fontWeight='600'>Assigned Vehicle</Text>
                  <Text fontSize='sm' color={textSecondary}>{data.vehicleId}</Text>
                </Box>
              </HStack>
              <Badge whiteSpace='nowrap' alignSelf='center' size='sm'>{data.capacity}</Badge>
            </Flex>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Map and Actions */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='20px'>
        <Card p='16px'>
          <Text fontSize='lg' fontWeight='bold' mb='12px'>Live Tracking</Text>
          <Box h={{ base: '260px', md: '320px' }} borderRadius='12px' bg={subtle} borderWidth='1px' borderColor={useColorModeValue('gray.200','gray.600')} display='flex' alignItems='center' justifyContent='center'>
            <VStack spacing={1}>
              <Icon as={MdMap} w='32px' h='32px' color='gray.400' />
              <Text fontSize='sm' color={textSecondary}>Map placeholder — integrate map SDK here</Text>
            </VStack>
          </Box>
        </Card>

        <Card p='16px'>
          <Text fontSize='lg' fontWeight='bold' mb='10px'>Shift & Quick Actions</Text>
          <HStack spacing={3} mb='12px' flexWrap='wrap'>
            <Badge colorScheme='green' size='sm' whiteSpace='nowrap'>Start {data.shift.start}</Badge>
            <Badge colorScheme='red' size='sm' whiteSpace='nowrap'>End {data.shift.end}</Badge>
          </HStack>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing='10px'>
            <Button leftIcon={<MdPlayArrow />} colorScheme='green' variant='solid' w='100%'>Start Shift</Button>
            <Button leftIcon={<MdStop />} colorScheme='red' variant='outline' w='100%'>End Shift</Button>
            <Button leftIcon={<MdReportProblem />} colorScheme='orange' variant='outline' w='100%'>SOS</Button>
            <Button leftIcon={<MdReportProblem />} colorScheme='pink' variant='outline' w='100%'>Report Incident</Button>
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
