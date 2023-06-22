import axios from 'axios'
import { uniqBy } from 'lodash'

const _defaultMessage = 'Search for the movie title'

export default {
  namespaced: true,
  state: () => ({
    movies: [],
    message: 'Search for the movie title',
    loading: false,
    theMovie: {}
  }),
  getters: {},
  mutations: {
    updateState(state, payload) {
      // Object.keys(payload) = ['movies', 'message', 'loading']
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  },
  actions: {
    async searchMovies({ state, commit }, payload) {
      // 여러번 실행하는 것을 방지하는 조건문
      if (state.loading) {
        return 
      }

      // 검색이 시작 되면
      commit('updateState', {
        message: '',
        loading: true
      })

      // 페이지 최초 요청
      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data

        commit('updateState', {
          movies: uniqBy(Search, 'imdbID')
        })
  
        console.log(totalResults) // 317
        console.log(typeof totalResults) // string
  
        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10)
  
        // 추가 요청
        if (pageLength > 1) {
          for(let page = 2; page <= pageLength; page += 1) {
            if (page > (payload.number / 10)) {
              break
            }
            const res = await _fetchMovie({
              ...payload,
              page: page
            })
            const { Search } = res.data

            commit('updateState', {
              movies: [
                ...state.movies, 
                ...uniqBy(Search, 'imdbID')
              ]
            })
          }
        }
      } catch ({ message }) {
        commit('updateState', {
          movies: [],
          message: message
        })
      } finally {
        commit('updateState', {
          loading: false,
        })
      }

    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) {
        return
      }

      commit('updateState', {
        theMovie: {},
        loading: true
      })

      try {
        const res = await _fetchMovie(payload)
        console.log(res.data)
        commit('updateState', {
          theMovie: res.data
        })
      } catch(err) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}