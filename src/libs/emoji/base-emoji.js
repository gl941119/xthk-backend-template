import emojiConfig from './emoji.js'
let emoji2img = {}
emojiConfig.forEach(({ code, filePath }) => {
  emoji2img[code] = require(`../../assets/images/emoji/${filePath}`)
})
export default emoji2img
