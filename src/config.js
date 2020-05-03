exports.SITE_DOCMENT_TITLE = "哈哈一乐";   // 网站标题

// console.log("process.env.NODE_ENV",process.env.NODE_ENV)
// console.log("process.env.NODE_ENV",typeof process.env.NODE_ENV)
// console.log("process.env.NODE_ENV",process.env.NODE_ENV == "production")
exports.isDev = process.env.NODE_ENV != "production";