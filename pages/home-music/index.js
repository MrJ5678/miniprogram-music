// pages/home-music.js
import { rankingStore, rankingMap } from "../../store/index";
import { getBanners, getSongMenu } from "../../service/api_music";
import { queryRect } from "../../utils/query-rect";
import throttle from "../../utils/throttle";

const throttleRectQuery = throttle(queryRect, 100);

Page({
  data: {
    banners: [],
    swiperHeight: 0,
    hotSongMenu: [],
    recommendSongMenu: [],
    recommendSongs: [],
    rankings: {0: {}, 2: {}, 3: {}}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 banner 数据
    this.getPageData();

    // 获取共享数据
    rankingStore.dispatch("getRankingDataAction");

    // 从 store 中获取共享数据
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs })
    });

    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))
  },

  // 请求 banners 等数据
  getPageData() {
    getBanners().then((res) => {
      this.setData({ banners: res.banners });
    });

    getSongMenu().then(res => {
      let newPlayList = []
      newPlayList = res.playlists.map((item, index) => {
        if(item.name.includes("\“")) {
          return {
            ...item,
            name: item.name.slice(1, item.name.length - 1)
          }
        } else {
          return item
        }
      })
      this.setData({ hotSongMenu: newPlayList })
    })

    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  // 点击搜索框区域事件
  handleSearchClick() {
    wx.navigateTo({
      url: "/pages/detail-search/index",
    });
  },

  // 监听图片加载完成事件
  handleSwiperImageLoaded() {
    // 获取图片高度
    throttleRectQuery(".swiper-image").then((res) => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  getRankingHandler(index) {
    return (res) => {
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const songList = res.tracks.slice(0, 3)
      const playCount = res.playCount
  
      const rankingObj = { name, coverImgUrl, songList, playCount }
      const newRankings = { ...this.data.rankings, [index]: rankingObj }

      this.setData({
        rankings: newRankings
      })
    }
  },

  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick(event) {
    const idx = +event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },
  
  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  y(e) {
    console.log("home-music 监听到 一个模块的某个部分被点击");
    if(e.detail === "推荐歌单") {
      console.log(" click 推荐歌单");
    } else if(e.detail === "热门歌单") {
      console.log(" click 热门歌单");
    }
  }
});
