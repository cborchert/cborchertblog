import React from 'react'
import Layout from '../components/Layout'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'
import './about.scss'

const AboutPage = () => (
  <Layout>
    <Helmet>
      <html lang="en" />
      <title>{`about | cborchert.blog`}</title>
      <meta property="og:title" content={`about | cborchert.blog`} />
      <meta property="twitter:title" content={`about | cborchert.blog`} />
      <meta
        name="description"
        content={
          'Chris Borchert is a freelance javascript developer living near Paris, France.'
        }
      />
      <meta
        property="og:description"
        content={
          'Chris Borchert is a freelance javascript developer living near Paris, France.'
        }
      />
      <meta
        property="twitter:description"
        content={
          'Chris Borchert is a freelance javascript developer living near Paris, France.'
        }
      />

      <meta
        name="keywords"
        content={'javascript, react, web development, Chris, Borchert'}
      />
    </Helmet>
    <div className="about__inner">
      <h1>Hi, my name is Chris.</h1>
      <AvatarImage />
      <p>
        I'm a freelance javascript developer living near Paris, France.
        Sometimes I write to share what I've been learning. You can see some
        examples of my of my work and contact me through my portfolio at{' '}
        <a href="https://cborchert.com">cborchert.com</a>.
      </p>
    </div>
  </Layout>
)

const AvatarImage = () => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "avatar.png" }) {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <div className="about__avatar">
        <Img fluid={data.placeholderImage.childImageSharp.fluid} />
      </div>
    )}
  />
)

export default AboutPage
