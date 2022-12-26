import { Flex, Text, Link } from '@chakra-ui/react'
import React from 'react'
import { AiFillGithub } from 'react-icons/ai'

const Footer = () => {
  return (
    <Flex
      borderTopWidth={1}
      px={2}
      py={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link href="https://ebpto.com">
         ebpto
        </Link>
      
      <Flex alignItems="center">
      <Text mr={6} fontSize="sm">
        Powered by{' '}
        <Link
          textDecoration="underline"
          href="https://twitter.com/ownyourip"
        >
          StreamKit
        </Link>
      </Text>
      </Flex>
    </Flex>
  )
}

export default Footer
