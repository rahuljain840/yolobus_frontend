export const redirectionEnabled = url =>
  !/\w+-Places/.test(url) && url.toLowerCase() !== url;

export const homeApiUrl = () => {
  return 'http://nonstopwheels.com/api/values';
};
