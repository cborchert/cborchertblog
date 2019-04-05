import React, { Component } from 'react'
import crypt from 'crypt'

const letters = `aàáäbcçdeèéëfghiîïjklmnoöpqrstuüvwxyzAÀÁÄBCÇDEÈÉËFGHIÎÏJKLMNOÖPQRSTUÜVWXYZ1234567890 !@#$%^&*()_+-={}[]\\|;:"'<,>.?/~\``

export default class index extends Component {
  state = {
    text: '',
    encodedText: '',
  }
  onChange = e => {
    this.setState({
      ...this.state,
      text: e.target.value,
    })
  }
  onChangeEncoded = e => {
    this.setState({
      ...this.state,
      encodedText: e.target.value,
    })
  }
  encrypt(string) {
    const pushBy = this.props.pushBy || 4
    const encrypted = string.split('').map((letter, i) => {
      const index = letters.indexOf(letter)
      if (index > -1) {
        let newIndex = index + pushBy
        if (newIndex >= letters.length) {
          newIndex = newIndex - letters.length
        }
        return letters[newIndex]
      } else {
        return letter
      }
    })
    return encrypted.join('')
  }
  decrypt(string) {
    const pushBy = this.props.pushBy || 4
    const decrypted = string.split('').map((letter, i) => {
      const index = letters.indexOf(letter)
      if (index > -1) {
        let newIndex = index - pushBy
        if (newIndex < 0) {
          newIndex = newIndex + letters.length
        }
        return letters[newIndex]
      } else {
        return letter
      }
    })
    return decrypted.join('')
  }
  render() {
    return (
      <div>
        <textarea onChange={this.onChange} value={this.state.text} />
        <h1>encoded</h1>
        <div>{this.encrypt(this.state.text)}</div>
        <h1>decoded</h1>
        <textarea
          onChange={this.onChangeEncoded}
          value={this.state.encodedText}
        />
        <div>{this.decrypt(this.state.encodedText)}</div>
      </div>
    )
  }
}
