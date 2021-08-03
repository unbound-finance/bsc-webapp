import Vue from 'vue'
import VueTailwind from 'vue-tailwind'

const settings = {
  TTable: {
    classes: {
      table: 'shadow min-w-full border-b border-gray-200 dark:border-gray-800',
      tbody:
        'bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800',
      td:
        'px-6 py-2 whitespace-no-wrap text-sm leading-5 text-gray-700 dark:text-gray-600',
      theadTh:
        'px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs leading-4 font-medium text-gray-700 dark:text-gray-500 uppercase tracking-wider',
    },
  },
}

Vue.use(VueTailwind, settings)
