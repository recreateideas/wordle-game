import { headerHeightAtom } from "@/lib/atoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [headerHeight] = useAtom(headerHeightAtom);

  return (
    <>
      <Header />
      <Box
        as={"main"}
        transition="all"
        transitionDuration="500ms"
        style={{
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        {children}
      </Box>
    </>
  );
}
