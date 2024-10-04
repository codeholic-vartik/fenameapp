export const computedPercentage = computed(( {props}) => {
    if (props.target > 0) {
      return ((props.raised / props.target) * 100).toFixed(2);
    }
    return 0;
  });