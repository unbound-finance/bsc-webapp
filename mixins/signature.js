import { ethers } from 'ethers'
// import { TypedDataUtils } from 'ethers-eip712'

// import ERC20ABI from '~/configs/abi/ERC20'
// import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

export default {
  data() {
    return {
      balance: '',
    }
  },
  methods: {
    async getNonce(address) {
      const abi = ['function nonces(address) view returns (uint256)']
      // const provider = new ethers.providers.Web3Provider(web3.currentProvider)
      const contract = new ethers.Contract(
        '0x769fd7De5d4E6e8fc22800Acc3Ad5236B5847332',
        abi,
        signer
      )
      const nonce = (await contract.nonces(address)).toNumber()
      console.log('nonce', nonce)
      return nonce
    },

    getEIP712Signature(address, nonce) {
      // const nonce = await this.getNonce()
      const owner = address
      const Permit = [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
        {
          name: 'nonce',
          type: 'uint256',
        },
        {
          name: 'deadline',
          type: 'uint256',
        },
      ]
      const EIP712Domain = [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ]
      const message = {
        owner,
        spender: '0x769fd7De5d4E6e8fc22800Acc3Ad5236B5847332',
        value: '1000000000000000000',
        nonce,
        deadline: '1650585600',
      }
      const domain = {
        name: 'Uniswap V2',
        version: '1',
        chainId: parseInt(42),
        verifyingContract: '0x1443398Aa8E16E0F289B12ddCf666eeC4215bF46',
      }
      const data = JSON.stringify({
        types: {
          Permit,
          EIP712Domain,
        },
        primaryType: 'Permit',
        domain,
        message,
      })

      console.log(data)

      // const digest = TypedDataUtils.encodeDigest(data)
      // const digestHex = ethers.utils.hexlify(digest)

      //   const sig = sigUtil.signTypedData(ethUtil.toBuffer(privateKey), {
      //     data,
      //   })

      //   console.log(sig)

      return data
      // this.relaySig(nonce, sig)
    },
  },
}
