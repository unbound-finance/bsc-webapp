export const state = () => ({
  txStatus: null,
})

export const mutations = {
  SET_TX_STATUS(state, payload) {
    state.txStatus = payload
  },
}
