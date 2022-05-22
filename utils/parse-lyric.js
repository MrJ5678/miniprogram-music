const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export const parseLyric = lyricString => {
  const lyricStrings = lyricString.split("\n")

  const lyricInfos = []

  for (const lineString of lyricStrings) {
    // console.log(lineString);
    const timeResult = timePattern.exec(lineString)
    if(!timeResult) continue
    // 获取时间
    const minite = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3]
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
    const time = minite + second + millsecond
    // console.log(time);

    // 获取歌词文本
    const text = lineString.replace(timeResult[0], "")
    const lysicInfo = { time, text }
    lyricInfos.push(lysicInfo)
  }
  return lyricInfos
}