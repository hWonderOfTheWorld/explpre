import {
  Box,
  Code,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  Skeleton,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { Link, RouteComponentProps } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import Header from './components/Header'
import { formatAnchorStatus, truncate } from './helpers'
import useCommit from './hooks/useCommit'
import useDoc from './hooks/useDoc'
import { RemoteComponent } from './RemoteComponent'

interface DocProps extends RouteComponentProps {
  docId?: string
  commitId?: string
}

const Document = (props: DocProps) => {
  const { docId } = props
  const [commitId, setCommitId] = useState<string>()
  const [docContent, setDocContent] = useState<Object>()

  const [lens, setLens] = useState<any>()

  const {
    isLoading: initialDocIsLoading,
    error: intialDocerror,
    data: doc,
  } = useDoc(docId!)

  const {
    isLoading: commitIsLoading,
    error: commitError,
    data: commitDoc,
  } = useCommit(docId!, commitId!)

  const isLoading = initialDocIsLoading || commitIsLoading || false
  const error = intialDocerror || commitError

  useEffect(() => {
    // TODO: Clean this up, currently we're loading the initial document twice and this shouldn't be necessary
    // on the initial render/load
    let updateContent
    if (commitId && commitDoc && doc !== commitDoc) {
      if (!isLoading) {
        updateContent =
          commitDoc?.state?.next?.content ||
          commitDoc?.state?.content ||
          undefined
        setDocContent(updateContent)
      }
    } else {
      if (!isLoading) {
        updateContent =
          doc?.state?.next?.content || doc?.state?.content || undefined
        setDocContent(updateContent)
      }
    }
  }, [doc, commitId, commitDoc, isLoading])

  const { colorMode } = useColorMode()

  const handleChangeCommit = (newCommitId: string) => {
    if (commitId !== newCommitId) {
      setDocContent(undefined)
      setCommitId(newCommitId)
    }
  }

  const getSchemaFromDoc = (
    doc: any,
    initialDocIsLoading: any,
    intialDocerror: any
  ) => {
    if (
      (initialDocIsLoading || intialDocerror) &&
      doc?.state?.metadata?.schema
    ) {
      return
    }
    return doc?.state?.metadata?.schema?.substring(10) // substring removes `ceramic://` from beginning
  }

  const schema = getSchemaFromDoc(doc, initialDocIsLoading, intialDocerror)

  return (
    <>
      <Header schema={schema} setLens={setLens} docId={docId} />
      <>
        {error ? (
          <Text mb={6}>
            <BiErrorCircle /> Something's wrong – try another stream
          </Text>
        ) : (
          <>
        
            <div className="w-full mx-auto lg:w-11/12">
  <div className="bg-white border border-zinc-200  rounded-md my-6">
    <table className="min-w-max w-full table-auto">

      <tbody className="text-gray-600 text-sm font-light">
      <tr className="hover:bg-gray-100">
          <td className="py-3 px-6 text-left whitespace-nowrap">
            <div className="flex items-center">
              <span className="font-medium">Content</span>
            </div>
          </td>
          <td className="py-3 px-6 text-left">
            <div className="flex items-center">
            {isLoading ? (
                      <Skeleton height="20px" width={400} />
                    ) : docContent !== undefined ? (
                      (doc?.state.doctype === 'tile' &&
                        Object.entries(docContent!).map((entry: any[], i) => (
                          <Box key={i} mb={3}>
                            <Text mb={1} fontWeight="bold">
                              {entry[0] && entry[0].toString()}
                            </Text>
                            {typeof entry[1] === 'string' ? (
                              <Text>{entry[1]}</Text>
                            ) : (
                              <Box
                                backgroundColor={
                                  colorMode === 'dark' ? 'gray.900' : 'gray.50'
                                }
                                p={3}
                                borderRadius={5}
                                maxW={600}
                              >
                                <Code
                                  fontSize="sm"
                                  background="transparent"
                                  overflowX="auto"
                                  whiteSpace="pre"
                                  display="block"
                                >
                                  {JSON.stringify(entry[1], undefined, 2)}
                                </Code>
                              </Box>
                            )}
                          </Box>
                        ))) ||
                      (doc?.state.doctype === 'caip10-link' && (
                        <Text>{docContent.toString()}</Text>
                      ))
                    ) : (
                      <Text color="gray.300">No content</Text>
                    )}
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="py-3 px-6 text-left whitespace-nowrap">
            <div className="flex items-center">
              <span className="font-medium">Stream ID</span>
            </div>
          </td>
          <td className="py-3 px-6 text-left">
            <div className="flex items-center">
              <span> {docId && truncate(docId, 45)}</span>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="py-3 px-6 text-left whitespace-nowrap">
            <div className="flex items-center">
              <span className="font-medium">Network</span>
            </div>
          </td>
          <td className="py-3 px-6">
            <span className="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">
              Mainnet
            </span>
          </td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="py-3 px-6 text-left whitespace-nowrap">
            <div className="flex items-center">
              <span className="font-medium">Anchoring</span>
            </div>
          </td>
          <td className="py-3 px-6 text-left">
            <div className="flex items-center">
            {doc?.state?.anchorStatus !== undefined && (
                      <Box mb={3}>
                        <Text fontWeight="bold" mb={1}>
                          Status
                        </Text>
                        <Text>
                          {doc?.state &&
                            formatAnchorStatus(doc!.state.anchorStatus)}
                        </Text>
                      </Box>
                    )}
            </div>
          </td>
        </tr>

        {doc?.state?.metadata ? (
                      Object.entries(doc?.state?.metadata).map(
                        (entry: any[], i) => (
                          <tr className="hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                            <Text fontWeight="bold" mb={1}>
                              {entry[0] && entry[0].toString()}
                            </Text>
                            </td>
                            {entry[0].toString() === 'schema' ? (
                              <td className="py-3 px-6 text-left">
                              <Link
                                to={`/document/${entry[1]?.replace(
                                  /^ceramic:\/\//,
                                  ''
                                )}`}
                              >
                                <Text
                                  bgGradient="linear(to-r, orange.600, orange.400)"
                                  fontWeight="bold"
                                  bgClip="text"
                                  wordBreak="break-all"
                                >
                                  {entry[1] && truncate(entry[1].toString(), 45)}
                                </Text>
                              </Link>
                              </td>
                            ) : (
                              <td className="py-3 px-6 text-left">
                              <Text
                                wordBreak="break-all"
                              >
                                {entry[1] && truncate(entry[1].toString().replace('orbis', 'streamkit'), 45)}
                              </Text>
                              </td>
                            )}
                          </tr>
                        )
                      )
                    ) : (
                      <>
                        {isLoading ? (
                          <Skeleton height="20px" width="100%" />
                        ) : (
                          <Text>Get a document to see its metadata</Text>
                        )}
                      </>
                    )}

            
            <tr>

            </tr>


            <tr className="hover:bg-gray-100">
          <td className="py-3 px-6 text-left whitespace-nowrap">
            <div className="flex items-center">
              <span className="font-medium">History</span>
            </div>
          </td>
          <td className="py-3 px-6 text-left">
          {doc?.state?.log ? (
                        (doc?.state?.log).reverse().map((commit, i) => (
                          <Box key={i} mb={3}>
                            <ChakraLink
                              onClick={() =>
                                handleChangeCommit(commit.cid.toString())
                              }
                              mb={1}
                            >
                              <Flex alignItems="center">
                                {(commit.cid.toString() === commitId ||
                                  (!commitId && i === 0)) &&
                                  '[X]'}{' '}
                                <Text>
                                  {commit?.cid && truncate(commit?.cid?.toString(), 45)}
                                </Text>{' '}
                                {i === 0 && '(latest)'}
                              </Flex>
                            </ChakraLink>
                          </Box>
                        ))
                      ) : (
                        <>
                          {isLoading ? (
                            <Skeleton height="20px" width="100%" />
                          ) : (
                            <Text>Get a stream to see its log</Text>
                          )}
                        </>
                      )}
            </td>
          </tr>



      </tbody>
    </table>
  </div>
</div>


          </>
        )}
      </>
    </>
  )
}

export default Document
