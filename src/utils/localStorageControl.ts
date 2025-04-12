const getItem = (key) => {
  const data = typeof window !== 'undefined' ? localStorage.getItem(key) : '';

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const setItem = (key, value) => {
  const stringify = typeof value !== 'string' ? JSON.stringify(value) : value;
  return localStorage.setItem(key, stringify);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
