import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../../components/card/Card';

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p='20px'>
        <Text fontSize='2xl' fontWeight='bold' mb='20px'>
          Edit Student (ID: {id})
        </Text>
        <Text color='gray.500' mb='20px'>
          This page will contain the form to edit student details.
        </Text>
        <Button colorScheme='gray' onClick={() => navigate('/admin/students')}>
          Back to Students List
        </Button>
      </Card>
    </Box>
  );
}
