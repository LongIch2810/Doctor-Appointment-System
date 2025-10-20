export const extractTokenFromCookie = (client: any): string | null => {
  try {
    const cookies = client?.handshake?.headers?.cookie;
    if (!cookies) return null;
    console.log('>>> cookies : ', cookies);
    const cookieArray = cookies.split('; ');
    console.log('>>> cookieArray : ', cookieArray);
    const cookieMap = cookieArray.reduce((acc: any, cookie: string) => {
      const [key, value] = cookie.split('=');
      if (key && value) acc[key.trim()] = decodeURIComponent(value);
      return acc;
    }, {});
    console.log('>>> cookieMap : ', cookieMap);
    return cookieMap['accessToken'] || null;
  } catch (error) {
    return null;
  }
};
