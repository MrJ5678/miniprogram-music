// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from "../../service/api_search";
import debounce from "../../utils/debounce";
import stringToNodes from "../../utils/stringToNodes"

const debounceGetSearchSuggest = debounce(getSearchSuggest, 50)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeyWords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    searchValue: "",
    resultSongs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },

  // 获取数据
  getPageData() {
    getSearchHot().then(res => {
      const hotKeyWords = res.result.hots;
      this.setData({ hotKeyWords })
    })
  },

  // 搜索框内容变化事件
  handleSearchChange(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if(!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ resultSongs: [] })
      this.setData({ suggestSongsNodes: [] })
      return
    }
    debounceGetSearchSuggest().then(res => {
      // 获取搜索联想
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })

      // 转成 nodes
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, this.data.searchValue)
        suggestSongsNodes.push(nodes)
      }  

      this.setData({ suggestSongsNodes})
    })
  },

  // 点击搜索框确定按钮事件 
  handleSearchAction() {
    if(!this.data.searchValue) return
    const keywords = this.data.searchValue
    getSearchResult(keywords).then(res => {
      const resultSongs = res.result.songs
      this.setData({ resultSongs })
    })
  },

  // 搜索联想项点击
  handleKeywordItemClick(event) {
    // 获得点击项
    const keyword = event.currentTarget.dataset.keyword;
    // 
    this.setData({ searchValue: keyword })

    this.handleSearchAction()
  },
})