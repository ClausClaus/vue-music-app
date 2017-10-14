function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  /* 从0到i之间取一个索引数，拿这个索引对应的项跟这个原本按照顺序的arr[i]做一个交换
   * 实现将数组打乱的效果 */
  let _arr = arr.slice();
  for (var i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

/**
 * 节流函数
 * @param func 要被节流的函数
 * @param delay 需要延时的时间
 *
 */
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
