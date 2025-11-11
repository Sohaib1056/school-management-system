import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

// Assets
import logo from "assets/img/logo.png";

export function SidebarBrand() {
  return (
    <Flex align='center' direction='column'>
      <Image src={logo} h='42px' w='auto' my='24px' alt="MindSpire SMS Logo" />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
