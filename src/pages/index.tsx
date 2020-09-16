import Head from "next/head";
import React from "react";

import { Game } from "../components/Game";

function Index() {
  return (
    <>
      <Head>
        <title>Tic Tac Toe</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        ></link>
      </Head>

      <Game />
    </>
  );
}

export default Index;
