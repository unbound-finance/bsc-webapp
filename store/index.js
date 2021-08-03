export const state = () => ({
  address: null,
  network: null,
  currentBlock: 0,
  txStatus: null,
})

export const mutations = {
  getProvider(state, address) {
    state.address = address
  },
  SET_NETWORK(state, network) {
    state.network = network
  },
  SET_CURRENT_BLOCK(state, payload) {
    state.currentBlock = payload
  },
}

export const getters = {
  getAddress: (state) => {
    return state.address
  },
  getNetworkID: (state) => {
    return state.network
  },
}
