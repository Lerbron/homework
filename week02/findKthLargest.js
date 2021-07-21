const findKthLargest = (nums, k) => {
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < nums.length - 1 - i; j++) {
      if (nums[j] > nums[j + 1])
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]
    }
  }
  return nums[nums.length - k]
};