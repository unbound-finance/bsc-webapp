export const state = () => ({
  address: null,
})

export const mutations = {
  getProvider(state, address) {
    state.address = address
  },
}
