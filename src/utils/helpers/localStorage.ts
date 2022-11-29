const USER_TOKEN = 'USER_TOKEN';

const getData = (key: string) => {
  try {
    const value = typeof window !== 'undefined' && localStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getToken = () => {
  try {
    const value = getData(USER_TOKEN);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const deleteToken = () => {
  const result = deleteData(USER_TOKEN);
  return result;
};

const deleteData = (key: string) => {
  try {
    typeof window !== 'undefined' && localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

const saveState = (key: string, value: any) => {
  try {
    const serializedState = value;
    typeof window !== 'undefined' && localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};

export const saveToken = (value: string) => {
  try {
    saveState(USER_TOKEN, value);
    return true;
  } catch {
    return false;
  }
};
