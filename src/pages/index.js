import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Fuse from 'fuse.js';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

export default function Home({ products, bands }) {
  const [activeBand, setActiveBand] = useState();
  const [query, setQuery] = useState();

  let activeProducts = products;

  if (activeBand) {
    activeProducts = activeProducts.filter(({ bands }) => {
      const bandIds = bands.map(({ slug }) => slug);

      return bandIds.includes(activeBand);
    });
  }

  const fuse = new Fuse(activeProducts, {
    keys: ['title', 'bands.name']
  });

  if (query) {
    const results = fuse.search(query);

    activeProducts = results.map(({ item }) => item);
  }

  function handleOnSearch(event) {
    const value = event.currentTarget.value;

    setQuery(value);
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1 className="sr-only">Merch stand</h1>

        <div className={styles.discover}>
          <div className={styles.filter}>
            <h2>Filter by Band</h2>
            <ul>
              {bands.map((band) => {
                const isActive = band.slug === activeBand;
                let bandClassName;

                if (isActive) {
                  bandClassName = styles.bandIsActive;
                }

                return (
                  <li key={band.id}>
                    <Button
                      className={bandClassName}
                      colour="yellow"
                      onClick={() => setActiveBand(band.slug)}
                    >
                      {band.name}
                    </Button>
                  </li>
                );
              })}
              <li>
                <Button
                  className={!activeBand && styles.bandIsActive}
                  colour="yellow"
                  onClick={() => setActiveBand(undefined)}
                >
                  View All
                </Button>
              </li>
            </ul>
          </div>

          <div className={styles.search}>
            <h2>Search</h2>
            <form>
              <input onChange={handleOnSearch} type="search" />
            </form>
          </div>
        </div>

        <h2 className="sr-only">Available merch</h2>

        <ul className={styles.products}>
          {activeProducts.map((product) => {
            const { featuredImage } = product;

            return (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image
                        src={featuredImage.sourceUrl}
                        height={featuredImage.mediaDetails.height}
                        width={featuredImage.mediaDetails.width}
                        alt={featuredImage.altText}
                      />
                      <h3 className={styles.productTitle}>{product.title}</h3>
                      <p className={styles.productPrice}>
                        {`£${product.productPrice}`}
                      </p>
                    </div>
                  </a>
                </Link>

                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={product.productId}
                    data-item-price={product.productPrice}
                    data-item-url="/"
                    data-item-description=""
                    data-item-image={featuredImage.sourceUrl}
                    data-item-name={product.title}
                  >
                    Add to cart
                  </Button>
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://merchstand-api.mellisdev.co.uk/graphql',
    cache: new InMemoryCache()
  });

  const response = await client.query({
    query: gql`
      query AllProductsAndBands {
        products {
          edges {
            node {
              id
              slug
              product {
                productPrice
                productId
              }
              title
              uri
              content
              featuredImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
              bands {
                edges {
                  node {
                    id
                    name
                    slug
                  }
                }
              }
            }
          }
        }
        bands {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
      }
    `
  });

  const products = response.data.products.edges.map(({ node }) => {
    const data = {
      ...node,
      ...node.product,
      featuredImage: {
        ...node.featuredImage.node
      },
      bands: node.bands.edges.map(({ node }) => node)
    };

    return data;
  });

  const bands = response.data.bands.edges.map(({ node }) => node);

  return {
    props: {
      products,
      bands
    }
  };
}
