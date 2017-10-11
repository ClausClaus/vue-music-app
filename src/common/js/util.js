function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  /* 从0到i之间取一个索引数，拿这个索引对应的项跟这个原本按照顺序的arr[i]做一个交换
   * 实现将数组打乱的效果 */
  for (var i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}
