/*
 * @Author: Hey
 * @Date: 2021-02-01 16:37:47
 * @LastEditTime: 2021-02-04 11:03:56
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\utils\stroage.js
 */
export const setStroage = (key, value) => localStorage.setItem(key, value)
export const setLoginStroage = (key, value) => sessionStorage.setItem(key, value)

export const getStroage = key => localStorage.getItem(key)
export const getLoginStroage = key => sessionStorage.getItem(key)

export const removeStroage = key => localStorage.removeItem(key)
