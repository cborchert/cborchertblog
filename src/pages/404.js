import React from 'react'
import Layout from '../components/Layout'
import GiphyEmbed from '../components/GiphyEmbed'
import './404.scss'

const NotFoundPage = () => (
  <Layout>
    <div className="page-404__inner">
      <h1>Page not found</h1>
      <GiphyEmbed
        src="https://giphy.com/embed/MJ6SslGZEYKhG"
        credit="https://giphy.com/gifs/escher-perfect-loops-m-c-MJ6SslGZEYKhG"
        width="480"
        height="353"
      />
      <p>
        The page you're looking for doesn't exist, has been moved, or is taking
        a short break.
      </p>
    </div>
  </Layout>
)

export default NotFoundPage
