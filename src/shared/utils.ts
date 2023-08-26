/* eslint-disable @typescript-eslint/no-explicit-any */
const asyncForEach = async (array: any[], callback: any) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    await callback(element, i, array);
  }
};

export const GlobalUtils = {
  asyncForEach,
};
