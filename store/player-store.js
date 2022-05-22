import { HYEventStore } from "hy-event-store";
import { getSongDetail, getSongLyric } from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: []
  },

  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      ctx.id = id

      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      // 请求歌词信息
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        ctx.lyricInfos = lyricInfos
      })

      // 播放对应 id 的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = false
    }
  }
})
export {
  audioContext,
  playerStore
}