import { createElement, dataToJson, jsonToData, getData, setData, createIconItem, createIcon, createAlertWindow, searchForm, modal, checkValidInput } from './data.js'
setData('pageTags', dataToJson([]))
document.addEventListener('DOMContentLoaded', () => {
    setData('lastPage', dataToJson(window.location.href))
    searchForm()
    createIcon()
})