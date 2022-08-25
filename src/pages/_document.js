import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="<https://app.snipcart.com>" />
        <link rel="preconnect" href="<https://cdn.snipcart.com>" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          async
          src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
        />
        <div
          id="snipcart"
          data-config-modal-style="side"
          data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
          data-currency="gbp"
          data-templates-url="/snipcart-templates.html"
          hidden
        />
      </body>
    </Html>
  );
}
