<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="margin: auto; display: block; shape-rendering: auto"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      :stroke="color"
      :stroke-width="stroke"
      r="35"
      stroke-dasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        :dur="`${speed}s`"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: '18',
    },
    color: {
      type: String,
      default: '#ffffff',
    },
    stroke: {
      type: [String, Number],
      default: '8',
    },
    speed: {
      type: [String, Number],
      default: '1',
    },
  },
}
</script>
