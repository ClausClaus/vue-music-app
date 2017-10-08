export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ');
  newClass.push(className)
  el.className = newClass.join(' ');
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
/**
 * 
 * 
 * @export
 * @param { dom对象 } el 
 * @param { 要设置的data属性的名称 } name 
 * @param { 要设置的data属性的值 } val 
 * @returns 有传入val的话是设置，没有的话是获取
 */
export function getData(el, name, val) {
  const prefix = 'data-';
  const prefixname = prefix + name;
  if (val) {
    return el.setAttribute(prefixname, val);
  } else {
    return el.getAttribute(prefixname);
  }
}
