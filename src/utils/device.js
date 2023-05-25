export const isFacebookApp = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
}

export const isAndroid = () => {
  return navigator.userAgent.match('Android');
}

export const isIOS = () => {
  return navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod');
}

export const isMobile = () => {
  return isIOS() || isAndroid();
}

export const isiPhoneX = () => {
  if( isIOS() && (window.innerWidth == 375 || window.innerWidth == 414) && (window.innerHeight == 720 || window.innerHeight == 724 || window.innerHeight == 812 || window.innerHeight == 804 || window.innerHeight == 764 || window.innerHeight == 768 || window.innerHeight == 852) ) {
    return true;
  }
  return false
}

export const isSafariMobile = () => {
  return isMobile() && isIOS() && !isFacebookApp();
}
