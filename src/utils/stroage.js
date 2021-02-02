/*
 * @Author: Hey
 * @Date: 2021-02-01 16:37:47
 * @LastEditTime: 2021-02-01 16:40:11
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\utils\stroage.js
 */
export const setStroage = (key, value) => localStorage.setItem(key, value)

export const getStroage = key => localStorage.getItem(key)

export const removeStroage = key => localStorage.removeItem(key)
