import type { ReactNode } from "react";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} px={4}>
      <Box
        w="100%"
        maxW="400px"
        bg={cardBg}
        boxShadow="lg"
        borderRadius="xl"
        p={8}
      >
        <Heading size="lg" mb={2} textAlign="center">
          {title}
        </Heading>

        {subtitle && (
          <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
            {subtitle}
          </Text>
        )}

        {children}

        <Box mt={6}>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Task Manager — Proiect JAVA
          </Text>
        </Box>

        {footer && (
          <Box mt={4} textAlign="center">
            {footer}
          </Box>
        )}
      </Box>
    </Flex>
  );
}
