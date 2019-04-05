import React from 'react'

// import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import kebabCase from 'lodash/kebabCase'
import get from 'lodash/get'
import { Link, graphql } from 'gatsby'
import './topics.scss'

const TagsPage = ({
  data: {
    allMarkdownRemark,
    site: {
      siteMetadata: { title },
    },
  },
}) => {
  const tagsGroup = get(allMarkdownRemark, 'group', null)
  const tagsList = tagsGroup ? (
    <ul className="topics-list">
      {tagsGroup.map(tag => {
        return (
          <li key={tag.fieldValue} className="topics__single-topic">
            <Link to={`/topics/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue} ({tag.totalCount})
            </Link>
          </li>
        )
      })}
    </ul>
  ) : (
    <p>No topics are available at this time</p>
  )
  return (
    <Layout>
      <h1>Topics</h1>
      <p>Below are the topics of all posts in this blog.</p>
      {tagsList}
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { publishPost: { eq: true } } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
