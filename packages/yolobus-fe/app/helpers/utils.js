import appConfig from 'appConfig';

/**
 * Method to redirect to error page on client side.
 */
export const redirectToErrorPage = () => {
  window.location = `${appConfig.api_protocol}://${appConfig.server.public.host}${appConfig.errorPage}`;
};
