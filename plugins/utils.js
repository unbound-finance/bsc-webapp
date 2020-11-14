import { getERC20Price } from '~/mixins/info'

export default (_, inject) => {
  const ethPrice = async () => {
    const price = await getERC20Price('ethereum')
    return price
  }

  inject('ethPrice', ethPrice)
}
