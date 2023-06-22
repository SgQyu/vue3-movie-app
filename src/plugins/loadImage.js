export default {
  install(app) {
    app.config.globalProperties.$loadImage = (src) => {
      return new Promise((resolve) => {
        const img = document.createElement('img')
        img.src = src
        img.addEventListener('load', () => {
          // 완료가 되었다는 신호
          resolve()
        })
      })
    }
  }
}