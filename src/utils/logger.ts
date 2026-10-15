export const isDev =
  Boolean(
    (typeof import.meta !== "undefined" && import.meta.env?.DEV) ||
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "development")
  );

export const devLog = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (isDev) {
    console.warn(...args);
  }
};

export const devError = (...args: any[]) => {
  if (isDev) {
    console.error(...args);
  }
};
