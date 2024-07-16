import { Box, Spinner, useToast } from "@chakra-ui/react";
import * as React from "react";
import * as Bowser from "bowser";

const result = Bowser.getParser(window.navigator.userAgent);

export default function App() {
  const toast = useToast();
  toast({
    title: `Your operation system is ${result.getOSName()}`,
    description: `You are using ${result.getBrowserName()} with version ${result.getBrowserVersion()}`,
    status: "error",
    duration: 9000,
    isClosable: false,
  });

  return (
    <Box sx={{ my: 4 }}>
      <img src={`${process.env.PUBLIC_URL}/stage1.png`}></img>
      We Farm app
      <Spinner />
    </Box>
  );
}
