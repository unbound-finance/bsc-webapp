export const state = () => ({
  address: null,
})

export const mutations = {
  getProvider(state, address) {
    state.address = address
  },
}

export const getters = {
  getAddress: (state) => {
    return state.address
  },
}
