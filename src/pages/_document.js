import { Html, Head, Main, NextScript } from "next/document";

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
            </body>
        </Html>
    );
}
