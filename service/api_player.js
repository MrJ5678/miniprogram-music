import myRequest from './index'

export const getSongDetail = (ids) => {
  return myRequest.get("/song/detail", {
    ids
  })
}

export const getSongLyric = (id) => {
  return myRequest.get("/lyric", {
    id
  })
}