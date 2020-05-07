const getKeyWord = (string, num = 1) => {
    let kwords = string.replace(/[^\u4e00-\u9fa5]/gi, "");;
    if (kwords.length < 4) {
        return [kwords];
    }
    let kwList = [];
    for (let k = 0; k < num; k++) {
        var random = Math.round(Math.random() * 4);
        var startPos = Math.floor(Math.random() * (kwords.length - 4));
        var endPos = startPos + random;
        kwList.push(kwords.substring(startPos, endPos))
    }
    return kwList
}

exports.getKeyWord = getKeyWord;