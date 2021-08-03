import Vue from 'vue'
import { toFixed } from '~/utils'

Vue.filter('toFixed', (v, precision = 2) => Number(v).toFixed(precision))
Vue.filter('normalizedNumber', toFixed)

export default function (_, inject) {
  inject('normalizedNumber', toFixed)
}
