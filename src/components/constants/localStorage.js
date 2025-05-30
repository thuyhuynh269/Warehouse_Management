

export const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date()
  
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

export const setTokenWithExpiry = (value, ttl) => {
    const now = new Date()
  
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem('token', JSON.stringify(item))
}

export const getTokenWithExpiry = () => {
    const itemStr = localStorage.getItem('token')

    if (!itemStr) {
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
        localStorage.removeItem('token')
        return null
    }

    return item.value
}

export const removeToken = () => {
    localStorage.removeItem('token');
}