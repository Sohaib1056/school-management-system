/* eslint-disable */
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { 
  Box, 
  Flex, 
  HStack, 
  Text, 
  useColorModeValue, 
  Icon,
  Collapse,
  VStack
} from "@chakra-ui/react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

export function SidebarLinks(props) {
  const [openMenus, setOpenMenus] = useState({});
  
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // Check if any child route is active
  const hasActiveChild = (items) => {
    if (!items) return false;
    return items.some(item => 
      item.path && activeRoute(item.path.toLowerCase())
    );
  };

  // Toggle menu open/closed
  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Render sub-menu items
  const renderSubItems = (items, parentName) => {
    return items.map((item, index) => {
      if (item.hidden) return null;
      
      return (
        <NavLink key={index} to={item.layout + item.path}>
          <HStack
            spacing="22px"
            py="8px"
            ps="52px"
            _hover={{
              bg: useColorModeValue("gray.100", "whiteAlpha.100"),
              borderRadius: "8px"
            }}
          >
            <Text
              fontSize="sm"
              color={
                activeRoute(item.path.toLowerCase())
                  ? activeColor
                  : textColor
              }
              fontWeight={
                activeRoute(item.path.toLowerCase())
                  ? "600"
                  : "normal"
              }
            >
              {item.name}
            </Text>
            {activeRoute(item.path.toLowerCase()) && (
              <Box
                position="absolute"
                left="0"
                h="20px"
                w="3px"
                bg={brandColor}
                borderRadius="0 5px 5px 0"
              />
            )}
          </HStack>
        </NavLink>
      );
    });
  };

  // Main function to create links
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Skip hidden routes
      if (route.hidden) {
        return null;
      }
      
      // Handle collapsible routes with sub-items
      if (route.collapse && route.items) {
        const isOpen = openMenus[route.name] || hasActiveChild(route.items);
        const hasActive = hasActiveChild(route.items);
        
        return (
          <Box key={index} mb="4px">
            <Box
              onClick={() => toggleMenu(route.name)}
              cursor="pointer"
              _hover={{
                bg: useColorModeValue("gray.100", "whiteAlpha.100"),
                borderRadius: "8px"
              }}
            >
              <HStack
                spacing="22px"
                py="10px"
                ps="10px"
                pe="10px"
              >
                <Flex w="100%" alignItems="center">
                  <Box
                    color={hasActive ? activeIcon : textColor}
                    me="18px"
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me="auto"
                    color={hasActive ? activeColor : textColor}
                    fontWeight={hasActive ? "bold" : "500"}
                    fontSize="md"
                  >
                    {route.name}
                  </Text>
                  <Icon
                    as={isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight}
                    color={textColor}
                    w="20px"
                    h="20px"
                  />
                </Flex>
                {hasActive && (
                  <Box
                    position="absolute"
                    right="0"
                    h="36px"
                    w="4px"
                    bg={brandColor}
                    borderRadius="5px 0 0 5px"
                  />
                )}
              </HStack>
            </Box>
            <Collapse in={isOpen} animateOpacity>
              <VStack align="stretch" spacing="2px" mt="2px">
                {renderSubItems(route.items, route.name)}
              </VStack>
            </Collapse>
          </Box>
        );
      }
      
      // Handle category headers
      if (route.category) {
        return (
          <React.Fragment key={index}>
            <Text
              fontSize="md"
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt="18px"
              pb="12px"
            >
              {route.name}
            </Text>
            {route.items && createLinks(route.items)}
          </React.Fragment>
        );
      }
      
      // Handle regular links
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box mb="4px">
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="10px"
                  ps="10px"
                  _hover={{
                    bg: useColorModeValue("gray.100", "whiteAlpha.100"),
                    borderRadius: "8px"
                  }}
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me="18px"
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "500"
                      }
                      fontSize="md"
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  {activeRoute(route.path.toLowerCase()) && (
                    <Box
                      h="36px"
                      w="4px"
                      bg={brandColor}
                      borderRadius="5px"
                    />
                  )}
                </HStack>
              </Box>
            ) : (
              <Box mb="4px">
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="10px"
                  ps="10px"
                  _hover={{
                    bg: useColorModeValue("gray.100", "whiteAlpha.100"),
                    borderRadius: "8px"
                  }}
                >
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "500"
                    }
                    fontSize="md"
                  >
                    {route.name}
                  </Text>
                  {activeRoute(route.path.toLowerCase()) && (
                    <Box h="36px" w="4px" bg={brandColor} borderRadius="5px" />
                  )}
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
