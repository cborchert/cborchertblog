import React from 'react'
import { Link, graphql } from 'gatsby'
import { ArchiveFromProps } from '../components/Archive'
import Layout from '../components/Layout'
import get from 'lodash/get'
import './topic.scss'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const edges = get(data, 'allMarkdownRemark.edges', [])
  const totalCount = get(data, 'allMarkdownRemark.totalCount', 0)
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } published under "${tag}"`

  return (
    <Layout>
      <div className="single-topic">
        <div className="single-topic__header">
          <h1>{tagHeader}</h1>
        </div>
        <div className="single-topic__body">
          <ArchiveFromProps posts={edges} />
        </div>
        <div className="single-topic__footer">
          <Link to="/topics">All topics</Link>
        </div>
      </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: [$tag] } }
        fields: { publishPost: { eq: true } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            tags
            date(formatString: "MMMM D, YYYY")
            cover_image {
              publicURL
              childImageSharp {
                fluid(maxWidth: 900, maxHeight: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          timeToRead
          htmlAst
          fields {
            isPostPrivate
            permalink
            # tags
          }
        }
      }
    }
  }
`
