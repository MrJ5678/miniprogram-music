// pages/detail-songs/index.js
import { rankingStore } from "../../store/index";
import { getSongMenuDetail } from "../../service/api_music";

Page({
  data: {
    type: "",
    ranking: "",
    songInfo: {},
  },

  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if(type === "menu") {
      const id = options.id

      // 获取数据
      getSongMenuDetail(+id).then(res => {
        this.setData({ songInfo: res.playlist })
      })

    } else if(type === "rank") {
      const ranking = options.ranking
      this.setData({ ranking })
  
      // 获取数据
      rankingStore.onState(ranking, this.getRankingDataHandler)
    }
  },

  onUnload() {
    if(this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
    }
  },

  getRankingDataHandler(res) {
    this.setData({ songInfo: res })
  }
})