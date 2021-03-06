import axios from 'axios'
import Post from 'domain/Post'
import APIError from 'domain/APIError'

axios.interceptors.response.use(
  response => response,
  error => error.response
    ? Promise.reject(new APIError(error.response))
    : Promise.reject(error)
)

const parse = data => new Post(
  {
    id: data.postId,
    userId: data.userId,
    text: data.text,
    dateTime: new Date(data.dateTime)
  })

class PostService {
  async createPostByUser (userId, text) {
    const request = {
      text: text
    }
    const response = await axios.post(`${process.env.REACT_APP_API_URL}users/${userId}/timeline`,
      JSON.stringify(request))

    return parse(response.data)
  }

  async getPostsOfUser (userId) {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}users/${userId}/timeline`)

    return response.data.map(post => parse(post))
  }

  async fake_getPostsOfUser (userId) {
    var response = "";
    try {
      response = await axios.get(`https://localhost:3001/dev/message`)
    }catch(e){
      response = await axios.get(`https://b1776kqi2k.execute-api.us-east-1.amazonaws.com/dev/message`)
    }
    
    console.log("response", response)

    return response.data.map(post => parse(post))
  }

  async getWallOfUser (userId) {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}users/${userId}/wall`)

    return response.data.map(post => parse(post))
  }
}

export default new PostService()
