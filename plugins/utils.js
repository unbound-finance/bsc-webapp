import { getEthPrice } from '~/mixins/info'

export default (_, inject) => {
  const ethPrice = async () => {
    const price = await getEthPrice()
    return price
  }

  inject('ethPrice', ethPrice)
}
