import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card.js';

/**
 * AddTeacher component for creating new teacher records
 */
const AddTeacher = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    employmentType: 'fullTime',
    joiningDate: '',
  });
  
  // Additional state for subjects and classes (arrays)
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newClass, setNewClass] = useState('');
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  
  // Add a subject to the list
  const handleAddSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };
  
  // Remove a subject from the list
  const handleRemoveSubject = (subject) => {
    setSubjects(subjects.filter(s => s !== subject));
  };
  
  // Add a class to the list
  const handleAddClass = () => {
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
      setNewClass('');
    }
  };
  
  // Remove a class from the list
  const handleRemoveClass = (cls) => {
    setClasses(classes.filter(c => c !== cls));
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    
    if (subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    if (classes.length === 0) newErrors.classes = 'At least one class is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Show success message
      alert(`Teacher ${formData.name} added successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        qualification: '',
        employmentType: 'fullTime',
        joiningDate: '',
      });
      setSubjects([]);
      setClasses([]);
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Page Header */}
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Add New Teacher</Heading>
          <Text color={textColorSecondary}>Create a new teacher record in the system</Text>
        </Box>
      </Flex>
      
      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch" p={4}>
            {/* Personal Information */}
            <Box>
              <Heading size="md" mb={4}>Personal Information</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>
                
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                </FormControl>
                
                <FormControl isInvalid={errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
                </FormControl>
                
                <FormControl isInvalid={errors.qualification}>
                  <FormLabel>Qualification</FormLabel>
                  <Input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="E.g., PhD Mathematics, MSc Physics"
                  />
                  {errors.qualification && <FormErrorMessage>{errors.qualification}</FormErrorMessage>}
                </FormControl>
              </SimpleGrid>
            </Box>
            
            <Divider />
            
            {/* Employment Details */}
            <Box>
              <Heading size="md" mb={4}>Employment Details</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Employment Type</FormLabel>
                  <Select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                  >
                    <option value="fullTime">Full Time</option>
                    <option value="partTime">Part Time</option>
                  </Select>
                </FormControl>
                
                <FormControl isInvalid={errors.joiningDate}>
                  <FormLabel>Joining Date</FormLabel>
                  <Input
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />
                  {errors.joiningDate && <FormErrorMessage>{errors.joiningDate}</FormErrorMessage>}
                </FormControl>
              </SimpleGrid>
            </Box>
            
            <Divider />
            
            {/* Subjects */}
            <Box>
              <Heading size="md" mb={4}>Subjects</Heading>
              <FormControl isInvalid={errors.subjects}>
                <FormLabel>Add Subjects</FormLabel>
                <HStack>
                  <InputGroup>
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Enter subject name"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                    />
                  </InputGroup>
                  <IconButton
                    colorScheme="blue"
                    aria-label="Add subject"
                    icon={<AddIcon />}
                    onClick={handleAddSubject}
                  />
                </HStack>
                {errors.subjects && <FormErrorMessage>{errors.subjects}</FormErrorMessage>}
                
                <Box mt={4}>
                  <HStack spacing={2} flexWrap="wrap">
                    {subjects.map((subject, index) => (
                      <Tag
                        size="md"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="blue"
                        m={1}
                      >
                        <TagLabel>{subject}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveSubject(subject)} />
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              </FormControl>
            </Box>
            
            <Divider />
            
            {/* Classes */}
            <Box>
              <Heading size="md" mb={4}>Classes</Heading>
              <FormControl isInvalid={errors.classes}>
                <FormLabel>Add Classes</FormLabel>
                <HStack>
                  <InputGroup>
                    <Input
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      placeholder="E.g., 10A, 11B"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddClass())}
                    />
                  </InputGroup>
                  <IconButton
                    colorScheme="green"
                    aria-label="Add class"
                    icon={<AddIcon />}
                    onClick={handleAddClass}
                  />
                </HStack>
                {errors.classes && <FormErrorMessage>{errors.classes}</FormErrorMessage>}
                
                <Box mt={4}>
                  <HStack spacing={2} flexWrap="wrap">
                    {classes.map((cls, index) => (
                      <Tag
                        size="md"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="green"
                        m={1}
                      >
                        <TagLabel>{cls}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveClass(cls)} />
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              </FormControl>
            </Box>
            
            <Divider />
            
            {/* Submit Button */}
            <Box>
              <Button
                colorScheme="blue"
                size="lg"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Submitting"
                width={{ base: '100%', md: 'auto' }}
              >
                Add Teacher
              </Button>
            </Box>
          </VStack>
        </form>
      </Card>
    </Box>
  );
};

export default AddTeacher;
