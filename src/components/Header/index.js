import React from 'react'
import { Link } from 'gatsby'
import './header.scss'

const Header = ({ siteTitle, toggleMenu }) => (
  <>
    <div className="header__container">
      <div className="header__inner">
        <div className="header__inner__site-name">
          <Link to="/">cborchert.blog</Link>
        </div>
        <div className="header__inner__menu">
          <ul>
            <li>
              <Link to="/">articles</Link>
            </li>
            {/* <li>
              <Link to="/topics">topics</Link>
            </li> */}
            <li>
              <Link to="/about">about</Link>
            </li>
          </ul>

          {/* <a
            href="#"
            className="header__menu-toggle"
            onClick={e => {
              e.preventDefault()
              toggleMenu()
            }}
          >
            &hellip; menu
          </a> */}
        </div>
      </div>
    </div>
  </>
)

export default Header
