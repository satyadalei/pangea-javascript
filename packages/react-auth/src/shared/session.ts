import { APIResponse, AuthUser, CookieOptions, Token } from "@src/types";
import { isLocalhost } from "./utils";

type CookieObj = {
  [key: string]: string;
};

export const SESSION_DATA_KEY = "pangea-authn";
export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  cookieMaxAge: 60 * 60 * 24 * 2, // 48 Hours, in seconds
  cookieName: SESSION_DATA_KEY,
};

const BASE_COOKIE_FLAGS = "; path=/";

/*
  Session storage functions
*/

export function getStorageAPI(isUsingCookies: boolean): Storage {
  // Depending on if we're using cookies or not, we want to use a different storage Web API
  // When we use a cookie, use session storage
  // When we do not use a cookie, use local storage <--- default
  return isUsingCookies ? window.sessionStorage : window.localStorage;
}

export const getToken = (cookieName: string, storageAPI?: Storage) => {
  if (storageAPI === undefined) {
    const cookies = getCookies();

    return cookies[cookieName];
  }

  const data = getSessionData(storageAPI);
  return data?.active_token?.token;
};

export const getSessionData = (storageAPI = localStorage) => {
  const data = storageAPI.getItem(SESSION_DATA_KEY);
  const session_json = data ? JSON.parse(data) : {};

  return session_json;
};

export const getUserFromResponse = (data: APIResponse): AuthUser => {
  const activeToken = { ...data.result.active_token };
  const refreshToken = { ...data.result.refresh_token };

  // remove deplicate user data from tokens
  delete activeToken.email;
  delete activeToken.profile;
  delete refreshToken.email;
  delete refreshToken.profile;

  const user: AuthUser = {
    email: activeToken.email,
    profile: activeToken.profile,
    active_token: activeToken,
    refresh_token: refreshToken,
  };

  return user;
};

/*
  Cookie functions
*/

export const maybeAddSecureFlag = (
  cookie: string,
  cookieOptions: CookieOptions
): string => {
  const { cookieDomain } = cookieOptions;

  // Check the location.hostname
  // if we're not at localhost, then add the Secure flag
  // and also set the domain
  if (!isLocalhost(window.location.hostname)) {
    cookie += "; Secure";

    // If we include a cookieDomain, then make sure to set it
    // on the cookie
    if (cookieDomain !== undefined) {
      cookie += `; domain=${cookieDomain}`;
    }
  }

  return cookie;
};

export const getCookies = (): CookieObj => {
  const cookies = document.cookie
    .split(";")
    .map((str) => str.trim())
    .reduce((cookieObj: CookieObj, curr) => {
      const [cookieName, cookieValue] = curr.split("=");

      if (cookieName !== "") {
        cookieObj[cookieName] = cookieValue;
      }

      return cookieObj;
    }, {});

  return cookies;
};

export const setCookie = (
  key: string,
  value: string = "",
  cookieOptions: CookieOptions
) => {
  const { cookieMaxAge } = cookieOptions;

  let cookie = `${key}=${value}${BASE_COOKIE_FLAGS}; max-age=${cookieMaxAge}`;

  cookie = maybeAddSecureFlag(cookie, cookieOptions);

  document.cookie = cookie;
};

export const removeCookie = (key: string, cookieOptions: CookieOptions) => {
  const epoch = new Date(0);

  let cookie = `${key}=${BASE_COOKIE_FLAGS}; expires=${epoch.toUTCString()}; max-age=0`;

  cookie = maybeAddSecureFlag(cookie, cookieOptions);

  document.cookie = cookie;
};
