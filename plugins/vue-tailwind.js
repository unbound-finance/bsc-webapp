import Vue from 'vue'
import VueTailwind from 'vue-tailwind'

const settings = {
  TTable: {
    classes: {
      table: 'shadow min-w-full divide-y divide-gray-200',
      tbody: 'bg-white divide-y divide-gray-200',
      td: 'px-6 py-2 whitespace-no-wrap text-sm leading-5 text-gray-700',
      theadTh:
        'px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider',
    },
  },
}

Vue.use(VueTailwind, settings)
