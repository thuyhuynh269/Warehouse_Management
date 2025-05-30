export const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

export const setTokenWithExpiry = (value, ttl) => {
    setItemWithExpiry('token', value, ttl);
};

export const getTokenWithExpiry = () => {
    const itemStr = localStorage.getItem('token');
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
        localStorage.removeItem('token');
        return null;
    }

    return item.value;
};

export const removeToken = () => {
    localStorage.removeItem('token');
};