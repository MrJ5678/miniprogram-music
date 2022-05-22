import myRequest from "./index"

export const getTopMV = (offset, limit = 10) => {
  return myRequest.get("/top/mv", { offset, limit })
}

/**
 * 请求 MV 的播放地址
 * @param {number} id MV 的 id
 */
export const getMVURL = (id) => {
  return myRequest.get("/mv/url", {
    id
  })
}

/**
 * 请求 MV 的详情
 * @param {number} mvid MV 的 id
 */
export const getMVDetail = (mvid) => {
  return myRequest.get("/mv/detail", {
    mvid
  })
}

/**
 * 请求推荐视频
 * @param {number} id MV 的 id
 */
export const getRelatedVideo = (id) => {
  return myRequest.get("/related/allvideo", {
    id
  })
}