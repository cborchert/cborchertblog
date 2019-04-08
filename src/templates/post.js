import rehypeReact from 'rehype-react'
import Layout from '../components/Layout'
import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Link } from 'gatsby'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import classSet from 'react-classset'
import 'katex/dist/katex.min.css'
import './post.scss'

import CSSVarsFallback from '../components/Demos/CSSVarsFallback'

const SmartLink = ({ href, to, children, ...props }) => {
  let address = href || to
  let isExternal = false
  if (!address) {
    address = '/'
  } else if (
    address.indexOf('http://') === 0 ||
    address.indexOf('https://') === 0 ||
    address.indexOf('//') === 0
  ) {
    isExternal = true
  }
  if (isExternal) {
    return (
      <a href={address} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link to={address} {...props}>
      {children}
    </Link>
  )
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { a: SmartLink, cssvarsfallbackdemo: CSSVarsFallback },
}).Compiler

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const frontmatter = get(markdownRemark, 'frontmatter')
  const htmlAst = get(markdownRemark, 'htmlAst')
  const fields = get(markdownRemark, 'fields')
  const title = get(frontmatter, 'title', '[undefined]')
  const description = get(frontmatter, 'description')
  const excerpt = get(markdownRemark, 'excerpt')
  const timeToRead = get(markdownRemark, 'timeToRead', '1')
  const isPrivate = get(fields, 'isPostPrivate', false)
  const date = get(frontmatter, 'date', get(fields, 'createdDate'))
  const coverImageSrcSet = get(
    frontmatter,
    'cover_image.childImageSharp.fluid',
    null
  )
  const coverImagePublicUrl = `https://cborchert.blog${get(
    frontmatter,
    'cover_image.childImageSharp.fixed.src',
    ''
  )}`
  const coverImageHeight = get(
    frontmatter,
    'cover_image.childImageSharp.fixed.height',
    ''
  )
  const coverImageWidth = get(
    frontmatter,
    'cover_image.childImageSharp.fixed.width',
    ''
  )

  const coverImage = coverImageSrcSet ? <Img fluid={coverImageSrcSet} /> : ''
  const postClasses = classSet({
    'blog-post': true,
    'blog-post--with-cover': coverImage,
    'blog-post--no-cover': !coverImage,
    'blog-post--private': isPrivate,
  })
  const tags = get(markdownRemark, 'frontmatter.tags', [])
  const tagsElement =
    tags && tags.length ? (
      <ul className="blog-post__tags">
        <li key={-1} className="blog-post__tag">
          topics:
        </li>
        {tags.map((tag, i) => (
          <li key={i} className="blog-post__tag">
            <Link to={`/topics/${kebabCase(tag)}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    ) : (
      ''
    )

  const related = tagsElement ? (
    <div className="blog-post__related">
      <hr />
      <h4>Enjoy this article?</h4>
      <h3>Read something similar:</h3>
      <div className="blog-post__tags-container__bottom">{tagsElement}</div>
      <hr />
    </div>
  ) : (
    ''
  )
  return (
    <Layout>
      <Helmet>
        <title>{`cborchert.blog - ${title}`}</title>
        <meta property="og:title" content={`cborchert.blog - ${title}`} />
        <meta property="twitter:title" content={`cborchert.blog - ${title}`} />
        <meta
          name="description"
          content={
            description ||
            excerpt ||
            "Chris Borchert's blog about javascript, react, and web development"
          }
        />
        <meta
          property="og:description"
          content={
            description ||
            excerpt ||
            "Chris Borchert's blog about javascript, react, and web development"
          }
        />
        <meta
          property="twitter:description"
          content={
            description ||
            excerpt ||
            "Chris Borchert's blog about javascript, react, and web development"
          }
        />
        <meta property="twitter:card" content="summary" />
        <meta property="og:image" content={coverImagePublicUrl} />
        <meta property="og:image:width" content={coverImageWidth} />
        <meta property="og:image:height" content={coverImageHeight} />
        <meta property="twitter:image" content={coverImagePublicUrl} />

        <meta
          name="keywords"
          content={
            (tags && tags.join ? tags.join(', ') + ', ' : '') +
            'javascript, react, web development, Chris, Borchert'
          }
        />
      </Helmet>
      <div className={postClasses}>
        <div className="blog-post__inner">
          <div className="blog-post__header">
            <div className="blog-post__header__meta">
              <h1 className="blog-post__title">
                {title}{' '}
                {isPrivate ? (
                  <span className="blog-post__private-reminder">[PRIVATE]</span>
                ) : (
                  ''
                )}
              </h1>
              <h3 className="blog-post__date">{date}</h3>
              <div className="blog-post__time-to-read">
                Time to read: {timeToRead} minute
                {timeToRead === 1 ? '' : 's'}
              </div>
              <div className="blog-post__tags-container">{tagsElement}</div>
            </div>
            <div className="blog-post__header__image">{coverImage}</div>
          </div>
          <div className="blog-post__body">{renderAst(htmlAst)}</div>

          {related}
          <div className="blog-post__footer">
            {get(fields, 'siblings.prev.path') ? (
              <div>
                Previous Post:{' '}
                <Link to={fields.siblings.prev.path}>
                  {fields.siblings.prev.title}
                </Link>
              </div>
            ) : (
              ''
            )}
            {get(fields, 'siblings.next.path') ? (
              <div>
                Next Post:{' '}
                <Link to={fields.siblings.next.path}>
                  {fields.siblings.next.title}
                </Link>
              </div>
            ) : (
              ''
            )}
            {/* <div>
              <Link to="/">Home</Link>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($permalink: String!) {
    markdownRemark(
      fields: { permalink: { eq: $permalink }, publishPost: { eq: true } }
    ) {
      html
      htmlAst
      frontmatter {
        date(formatString: "MMMM D, YYYY")
        title
        tags
        description
        cover_image {
          publicURL
          childImageSharp {
            fluid(maxWidth: 900, maxHeight: 600) {
              ...GatsbyImageSharpFluid
            }
            fixed(width: 1200, height: 628) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
      timeToRead
      excerpt
      fields {
        isPostPrivate
        modifiedDate
        createdDate
        # siblings {
        #   prev {
        #     path
        #     title
        #   }
        #   next {
        #     path
        #     title
        #   }
        # }
      }
    }
  }
`
