import React from 'react'
import Link from 'gatsby-link'
import './menu.scss'

const Menu = ({ toggleMenu }) => (
  <div className="off-page-menu">
    <a
      className="off-page-menu__close"
      href="/#"
      onClick={e => {
        e.preventDefault()
        toggleMenu()
      }}
    >
      x
    </a>
    <ul className="off-page-menu__links">
      <li>
        <Link
          to="/"
          onClick={e => {
            toggleMenu()
          }}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/topics"
          onClick={e => {
            toggleMenu()
          }}
        >
          Topics
        </Link>
      </li>
      <li>
        <Link
          to="/"
          onClick={e => {
            toggleMenu()
          }}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          to="/"
          onClick={e => {
            toggleMenu()
          }}
        >
          Hire
        </Link>
      </li>
    </ul>
  </div>
)
export default Menu
