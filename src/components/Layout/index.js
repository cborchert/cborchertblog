import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from '../Header'
// import Menu from '../Menu'
import './layout.scss'

export default class Layout extends Component {
  state = {
    menuOpen: false,
  }

  toggleMenu = () => {
    this.setState({
      ...this.state,
      menuOpen: !this.state.menuOpen,
    })
  }

  render() {
    const { children } = this.props
    const layoutContainerClasses = this.state.menuOpen
      ? 'layout__container layout__container--menu-open'
      : 'layout__container'
    const innerLayoutOnclick = this.state.menuOpen
      ? e => {
          e.preventDefault()
          this.toggleMenu()
        }
      : () => {}
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
                description
                keywords
              }
            }
          }
        `}
        render={data => (
          <div className={layoutContainerClasses}>
            {/* <Menu toggleMenu={this.toggleMenu} /> */}
            <div className="layout">
              <Helmet>
                <html lang="en" />
                <title>{`cborchert.blog`}</title>
                <meta property="og:title" content={`cborchert.blog`} />
                <meta property="twitter:title" content={`cborchert.blog`} />
                <meta
                  name="description"
                  content={
                    "Chris Borchert's blog about javascript, react, and web development"
                  }
                />
                <meta
                  property="og:description"
                  content={
                    "Chris Borchert's blog about javascript, react, and web development"
                  }
                />
                <meta
                  property="twitter:description"
                  content={
                    "Chris Borchert's blog about javascript, react, and web development"
                  }
                />

                <meta
                  name="keywords"
                  content={
                    'javascript, react, web development, Chris, Borchert'
                  }
                />
              </Helmet>
              <Header
                siteTitle={data.site.siteMetadata.title}
                toggleMenu={this.toggleMenu}
              />
              <div className="layout__inner" onClick={innerLayoutOnclick}>
                {children}
              </div>
              <div className="layout__footer">
                © {new Date().getFullYear()} Christopher Borchert
              </div>
            </div>
          </div>
        )}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
