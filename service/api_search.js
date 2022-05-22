import myRequest from "./index"

export const getSearchHot = () => {
  return myRequest.get("/search/hot")
}

export const getSearchSuggest = (keywords) => {
  return myRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export const getSearchResult = (keywords) => {
  return myRequest.get("/search", {
    keywords
  })
}