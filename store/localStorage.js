export const state = () => ({
  txStatus: null,
})

export const mutations = {
  SET_TX_STATUS(state, payload) {
    state.txStatus = payload
  },
}

export const getters = {
  txStatus: (state) => {
    return state.txStatus
  },
}
