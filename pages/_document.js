import Document, { Html, Main, Head, NextScript } from "next/document";

class BaseDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/**font files */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
          <div id="overlay-entry"></div>
        </body>
      </Html>
    );
  }
}

export default BaseDocument;
