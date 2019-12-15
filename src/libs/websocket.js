import Centrifuge from 'centrifuge'

class WebSocket {
  constructor() {
    this.events = []
    this.centrifuge = null
  }

  connect({ url, token }) {
    this.centrifuge = new Centrifuge(url, {
      maxRetry: 1000
    })
    this.centrifuge.setToken(token)
    this.centrifuge.connect()

    this.centrifuge.on('connect', this.onConnect.bind(this))
    this.centrifuge.on('disconnect', this.onDisconnect.bind(this))
  }

  addEventListener(event, callback) {
    if (this.events[event]) {
      this.events[event].push(callback)
    } else {
      this.events[event] = [callback]
    }
  }

  removeEventListener(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event].find((m, i) => {
          if (m === callback) {
            this.events[event].splice(i, 1)
            return true
          }
        })
      } else {
        this.events[event] = []
      }
    }
  }

  onConnect() {
    if (!this.events['connect']) return

    this.events['connect'].map(e => {
      e()
    })
  }

  onDisconnect() {
    if (!this.events['disconnect']) return

    this.events['disconnect'].map(e => {
      e()
    })
  }
  disconnect() {
    if (this.centrifuge) {
      this.centrifuge.disconnect()
      this.centrifuge = null
    }
  }

  subscribe(channel, callback) {
    return this.centrifuge.subscribe(channel, callback)
  }
}

export default WebSocket
