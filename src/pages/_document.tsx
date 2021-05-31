import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="apple-touch-icon" sizes="180x180" href="public/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="public/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="public/favicons/favicon-16x16.png" />
          <link rel="manifest" href="public/favicons/site.webmanifest" />
          <link rel="mask-icon" href="public/favicons/safari-pinned-tab.svg" color="#000000" />
          <link rel="shortcut icon" href="public/favicons/favicon.ico" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-config" content="public/favicons/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:site_name" content="Webev" />
          <meta property="og:title" content="Webev" />
          <meta property="og:url" content="https://www.webev.cloud" />
          <meta property="og:description" content="Webev は、誰でも使えるブックマークマネージャーです！URL を入力して保存するだけで Web ページを管理できます。" />
          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Webev" />
          <meta
            name="twitter:description"
            content="Webev は、誰でも使えるブックマークマネージャーです！URL を入力して保存するだけで Web ページを管理できます。"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
