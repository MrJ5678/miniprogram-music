import myRequest from "./index"

export const getBanners = () => {
  return myRequest.get("/banner", { type: 2 })
}

export const getRankings = (idx) => {
  return myRequest.get("/top/list", {
    idx
  })
}

export const getSongMenu = (cat = "全部", limit = 6, offset = 0) => {
  return myRequest.get("/top/playlist", {
    cat, limit, offset
  })
}

export const getSongMenuDetail = (id) => {
  return myRequest.get("/playlist/detail/dynamic", {
    id
  })
}