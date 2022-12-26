import { Box, Flex, Heading } from '@chakra-ui/react'
import React from 'react'

const Logo = (props) => {
  const { size } = props

  return (
    <Box>
      <Flex alignItems="center">
      <div className="flex  mt-1 ">
              <div className="relative mt-3  mr-2 cursor-pointer">
                <div className="w-fit -rotate-[45deg]">
                  <div className="w-3 h-0.5 bg-pink-600 rounded-full mt-0.5 " />
                  <div className="w-3 h-0.5 bg-pink-600 rounded-full ml-1.5 mt-0.5" />
                  <div className="w-3 h-0.5 bg-pink-600 rounded-full mt-1 mt-0.5" />
                  <div className="w-3 h-0.5 bg-pink-600 rounded-full ml-1.5 mt-0.5" />
                </div>
              </div>
              <div className="uppercase tracking-widest text-md mt-3 mb-3 cursor-pointer">
                <span className="font-['SatoshiBlack']">Stream</span>
                <span className="font-['Satoshi]">Kit</span>
              </div>
              </div>
      </Flex>
    </Box>
  )
}

export default Logo
