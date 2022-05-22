// pages/music-player/index.js
import { NAVIGATION_BAR_HEIGHT } from "../../constants/device_constants";
import { audioContext, playerStore } from "../../store/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    sliderValue: 0,
    isSliderChanging: false,
    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })
    this.setupPlayerStoreListener()

    // 计算内容区高度
    let globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const contentHeight = screenHeight - statusBarHeight - NAVIGATION_BAR_HEIGHT
    const deviceRadio = globalData.deviceRadio

    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

    // audiocontext 的事件监听
    this.setupAudioContextListener()
  },

  // ======================== 事件处理 ========================

  // 页面滚动事件
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  // slider 变动事件
  handleSliderChange(event) {
    // slider 松手时 触发了 handleSliderChange
    this.setData({ isSliderChanging: false })
    // 获取 slider 变化的值
    const sliderValue = event.detail.value
    this.setData({ sliderValue })

    // slider 停止的位置
    const currentTime = this.data.durationTime * sliderValue / 100

    // 设置 context 播放 currentTime 的音乐
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
  },

  // slider changing 事件
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = value * this.data.durationTime / 100
    this.setData({ isSliderChanging: true, currentTime })
  },

  // 返回键点击事件
  handleBackClick() {
    wx.navigateBack()
  },

  // ======================== 事件监听 ========================
  setupAudioContextListener() {
    audioContext.onCanplay(() => {
      // audioContext.play()
    })
    audioContext.onTimeUpdate(() => {
      // 获取当前时间
      const currentTime = audioContext.currentTime * 1000
      // 设置 sliderValue & currentTime
      if(!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
      // 根据当前时间查找当前的歌词
      if(!this.data.lyricInfos.length) return
      let i = 0
      const lyricInfoLength = this.data.lyricInfos.length
      for (; i < lyricInfoLength - 1; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if(currentTime < lyricInfo.time) {
          break
        }
      }

      // 设置
      const currentIndex = i - 1
      if(this.data.currentLyricIndex !== currentIndex) {
        let currentLyricInfo = this.data.lyricInfos[currentIndex]
        console.log(currentLyricInfo.text);
        this.setData({
          currentLyricText: currentLyricInfo.text, 
          currentLyricIndex: currentIndex,
          lyricScrollTop: 35 * currentIndex 
        })
      }
    })
  },

  setupPlayerStoreListener() {
    playerStore.onStates([
      "currentSong",
      "durationTime",
      "lyricInfos"
    ], ({currentSong, durationTime, lyricInfos})=> {
      if(currentSong) this.setData({ currentSong })
      if(durationTime) this.setData({ durationTime })
      if(lyricInfos) this.setData({ lyricInfos })
    })
  }
})