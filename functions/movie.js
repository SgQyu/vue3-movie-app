const axios = require('axios')
const OMDB_API_KEY = process.env.OMDB_API_KEY


exports.handler = async function (event) {
  console.log(event)
  const payload = JSON.parse(event.body)
  const { title, type, year, page, id } = payload
  const url = id 
    // id의 데이터가 있는 경우 : 단일 영화정보의 상세 내용
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 

    // id의 데이터가 없는 경우 : 여러 개의 영화 데이터를 가져오는 링크
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
  try {
    const { data } = await axios.get(url)
    if (data.Error) {
      return {
        statusCode: 400,
        body: data.Error
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }

  } catch(err) {
    return {
      statusCode: err.response.status,
      body: err.message
    }
  }
}