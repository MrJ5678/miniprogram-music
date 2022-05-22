// pages/home-video.js
import { getTopMV } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },

  // 网络请求
  async getTopMVData(offset) {
    // 判断是否进行请求
    if(!this.data.hasMore && offset !== 0) return

    // 加载中动画
    wx.showNavigationBarLoading()
    // 进行请求
    const res = await getTopMV(offset)
    let newData = this.data.topMVs

    if(offset === 0) {
      newData = res.data
    } else {
      newData = [...newData, ...res.data]
    }
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if(offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 点击视频事件处理
  handleVideoItemClick(event) {
    // 获取 id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  },

  onReachBottom() {
    // 10 ~ 19
    this.getTopMVData(this.data.topMVs.length)
  },

  onPullDownRefresh() {
    this.getTopMVData(0)
  }
})