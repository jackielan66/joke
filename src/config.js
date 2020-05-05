exports.SITE_DOCMENT_TITLE = "先疯队";   // 后缀

exports.SITE_TTILE = "好玩的段子_糗事_搞笑_内容_每日轻松一刻 - 先疯队"
exports.SITE_KEYWORDS = "糗事,段子,搞笑,轻松";   // 网站关键词
exports.SITE_DESCRIPTION = '先疯队，搜集最新的轻松搞笑娱乐生活资讯,各种好玩的段子、糗事等。捕捉时下最新的互联网潮流动态信息，让您在忙碌的生活中，每日轻松一刻';   // 网站关键词


// console.log("process.env.NODE_ENV",process.env.NODE_ENV)
// console.log("process.env.NODE_ENV",typeof process.env.NODE_ENV)
// console.log("process.env.NODE_ENV",process.env.NODE_ENV == "production")
exports.isDev = process.env.NODE_ENV != "production";