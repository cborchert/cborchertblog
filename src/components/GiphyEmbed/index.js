import React from 'react'
import './giphy-embed.scss'

const GiphyEmbed = ({ src, credit, width, height, className, style }) => (
  <div className={`giphy-embed ${className ? className : ''}`}>
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      allowFullScreen
      title="Giphy Embed"
    />
    {credit ? (
      <p>
        <a href={credit}>via GIPHY</a>
      </p>
    ) : (
      ''
    )}
  </div>
)

export default GiphyEmbed
