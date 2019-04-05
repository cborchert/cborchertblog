import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import classSet from 'react-classset'

import './archive.scss'

export const markdownEdgesFragment = graphql`
  fragment PostContent on MarkdownRemark {
    id
    frontmatter {
      tags
      categories
      description
      title
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
      publishPost
      permalink
      # tags
    }
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
          filter: { fields: { publishPost: { eq: true } } }
        ) {
          edges {
            node {
              ...PostContent
            }
          }
        }
      }
    `}
    render={data => {
      return (
        <div>
          <ArchiveFromProps posts={get(data, 'allMarkdownRemark.edges', [])} />
        </div>
      )
    }}
  />
)

export const ArchiveFromProps = ({ posts }) => {
  return (
    <div className="archive">
      {posts
        .filter(({ node }) => get(node, 'fields.publishPost', false))
        .map(({ node }, i) => {
          // console.log(node)
          const path = get(node, 'fields.permalink', '#')
          const isPrivate = get(node, 'fields.isPostPrivate', false)
          // const publishPost = get(node, 'fields.publishPost', false)
          const date = get(node, 'frontmatter.date', '')
          const title = get(node, 'frontmatter.title', '')
          const tags = get(node, 'frontmatter.tags', []) || []
          const tagsElement =
            tags && tags.length ? (
              <ul className="archive__post__tags">
                <li key={-1} className="archive__post__tag">
                  topics:
                </li>
                {tags.map((tag, i) => (
                  <li key={i} className="archive__post__tag">
                    <Link to={`/topics/${kebabCase(tag)}`}>{tag}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )
          const categories = get(node, 'frontmatter.categories') || []
          const categoriesElement =
            categories && categories.length ? (
              <div className="archive__post__categories">
                published in {categories.join(', ')}
              </div>
            ) : (
              ''
            )
          const excerpt =
            get(node, 'frontmatter.description', '') || get(node, 'excerpt', '')
          const timeToRead = get(node, 'timeToRead', 0)
          const coverImageSrcSet = get(
            node,
            'frontmatter.cover_image.childImageSharp.fluid',
            null
          )
          const coverImage = coverImageSrcSet ? (
            <Img fluid={coverImageSrcSet} alt={title} title={title} />
          ) : (
            ''
          )
          const postClasses = classSet({
            archive__post: true,
            'archive__post--with-cover': coverImage,
            'archive__post--no-cover': !coverImage,
            'archive__post--private': isPrivate,
          })
          return (
            <div key={i} className={postClasses}>
              <div className="archive__post__image">
                <Link to={path}>{coverImage}</Link>
              </div>
              <div key={i} className="archive__post__inner">
                <h2 className="archive__post__title">
                  <Link to={path}>
                    {title || '[undefined]'}{' '}
                    {isPrivate ? (
                      <span className="archive__post__private-reminder">
                        [PRIVATE]
                      </span>
                    ) : (
                      ''
                    )}
                  </Link>
                </h2>
                <h5 className="archive__post__date">{date}</h5>
                <p className="archive__post__excerpt">{excerpt || '[...]'}</p>
                <p className="archive__post__time-to-read">
                  Time to read: {timeToRead} minute
                  {timeToRead === 1 ? '' : 's'}
                </p>
                <div className="archive__post__read-more">
                  <Link to={path}>Read More</Link>
                </div>
                <div className="archive__post__tags-container">
                  {tagsElement}
                </div>
                <div className="archive__post__categories-container">
                  {categoriesElement}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
