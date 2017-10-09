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

let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === 'standard') {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
