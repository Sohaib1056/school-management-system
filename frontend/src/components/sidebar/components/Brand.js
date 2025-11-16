import React, { useContext } from "react";

// Chakra imports
import { Flex, useColorModeValue, Image, IconButton, Tooltip } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

// Assets
import logo from "assets/img/logo.png";
import { SidebarContext } from "contexts/SidebarContext";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export function SidebarBrand() {
  const { toggleSidebar, setToggleSidebar } = useContext(SidebarContext) || {};
  const isCollapsed = !!toggleSidebar;
  const iconColor = useColorModeValue("gray.500", "gray.300");
  const tooltipLabel = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
  const ToggleIcon = isCollapsed ? MdKeyboardDoubleArrowRight : MdKeyboardDoubleArrowLeft;

  const handleToggle = () => {
    if (typeof setToggleSidebar === "function") {
      setToggleSidebar((prev) => !prev);
    }
  };

  return (
    <Flex align='center' direction='column'>
      <Flex align='center' justify='space-between' w='100%' px='4px'>
        <Image
          src={logo}
          h={isCollapsed ? '32px' : '42px'}
          w='auto'
          my='24px'
          alt="MindSpire SMS Logo"
          transition='all 0.2s ease'
        />
        {typeof setToggleSidebar === "function" && (
          <Tooltip label={tooltipLabel} placement='right'>
            <IconButton
              aria-label={tooltipLabel}
              size='sm'
              variant='ghost'
              borderRadius='full'
              icon={<ToggleIcon size={18} />}
              color={iconColor}
              _hover={{ bg: useColorModeValue('gray.100','whiteAlpha.100') }}
              onClick={handleToggle}
            />
          </Tooltip>
        )}
      </Flex>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
