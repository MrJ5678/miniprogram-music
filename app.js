// app.js
App({
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    deviceRadio: 0
  },

  onLaunch() {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenHeight = info.screenHeight

    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio
  }
})
