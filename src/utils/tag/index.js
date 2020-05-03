var Tag = require("../../models/Tag.js");


const { isDev } = require("../../config");

const TAG_WORDS = [
    "搞笑的", "逗b", "很搞笑的文章哈", "网易新闻"
]

console.log(isDev, "isDev")
console.log(process.env.NODE_ENV != "production", "production")


TAG_WORDS.forEach(tag => {
    let _condition = {
        name: tag
    }
    Tag.findOne(_condition).then((isHasContent) => {
        if (!isHasContent) {
            new Tag(_condition).save()
        }
    })
})