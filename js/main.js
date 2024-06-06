import { items, categories, circleSvg, payments, createElement, dataToJson, jsonToData, getData, setData, createIconItem, createIcon, createAlertWindow, searchForm, modal, checkValidInput } from './data.js'
setData('pageTags', dataToJson([]))
function createCategoriesItem(item) {
    const cont = createElement('li', '', ['categories__item'])
    if (item.special != null) {
        cont.classList.add(item.special)
    }
    const tagsList = createElement('ul', '', ['list-reset', 'categories__item-types'])
    for (const tagItem of item.tags) {
        let tagsItemLi = createElement('li', '', ['categories__item-type'])
        let tagItemContent = createElement('a', tagItem.title, ['categories__item-type-link'])
        tagItemContent.addEventListener('click', () => {
            let pageTags = jsonToData(getData('pageTags'))
            if (item.itemTag != null || item.itemTag != undefined) {
                pageTags = jsonToData(getData('pageTags'))
                if (pageTags.includes(item.itemTag) === false) {
                    pageTags.push(item.itemTag)
                    setData('pageTags', dataToJson(pageTags))
                }
            }
            window.location.href = "catalog.html";
        })
        tagsItemLi.append(tagItemContent)
        tagsList.append(tagsItemLi)
    }
    const title = createElement('h3', item.title, ['categories__item-title'])
    const mobileLinkText = createElement('h4', item.title)
    const mobileLink = createElement('a', circleSvg, ['categories__item-mobile'])
    mobileLink.addEventListener('click', () => {
        let pageTags = jsonToData(getData('pageTags'))
        if (item.itemTag != null || item.itemTag != undefined) {
            pageTags = jsonToData(getData('pageTags'))
            if (pageTags.includes(item.itemTag) === false) {
                pageTags.push(item.itemTag)
                setData('pageTags', dataToJson(pageTags))
            }
        }
        window.location.href = "catalog.html";
    })
    mobileLink.prepend(mobileLinkText)
    const itemImg = createElement('img', '', ['categories__item-img'], {alt: item.title, src: item.img})
    const itemMoreItem = createElement('a', circleSvg, ['categories__item-more'])
    const itemMoreTitle = createElement('h4', 'В каталог', ['categories__item-more-link'])
    itemMoreItem.addEventListener('click', () => {
        let pageTags = jsonToData(getData('pageTags'))
        if (item.itemTag != null || item.itemTag != undefined) {
            pageTags = jsonToData(getData('pageTags'))
            if (pageTags.includes(item.itemTag) === false) {
                pageTags.push(item.itemTag)
                setData('pageTags', dataToJson(pageTags))
            }
        }
        window.location.href = "catalog.html";
    })
    itemMoreItem.prepend(itemMoreTitle)
    cont.append(tagsList, title, mobileLink, itemImg, itemMoreItem)
    return cont
}

function formFunc() {
    const form = document.getElementById('feed-form')
    const inputName = document.getElementById('feed-name')
    inputName.addEventListener('input', () => {
        inputName.value = inputName.value.replace(/[^A-Za-zА-Яа-я]/g, '');
    })
    const phoneInput = document.getElementById('feed-tel');
    phoneInput.addEventListener('input', function(event) {
        let inputValue = event.target.value;
        let filteredValue = inputValue.replace(/\D/g, '');
        let formattedValue = '+7 ';
        for (let i = 1; i < filteredValue.length; i++) {
            if (i === 4 || i === 7 || i === 9) {formattedValue += ' ';}
            formattedValue += filteredValue[i];
        }
        phoneInput.value = formattedValue;
    })

    const inputEmail = document.getElementById('feed-mail')
    inputEmail.addEventListener('input', () => {
        let email = document.getElementById("feed-mail");
        let filteredEmail = email.value.replace(/[^a-zA-Z0-9@._-]/g, "");
        email.value = filteredEmail;
    })
    const inputCheck = document.getElementById('feed-check')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        if  (inputCheck.checked === true && inputEmail.value.includes('@') && inputEmail.value.includes('.') &&  phoneInput.value.length === 16) {
            inputName.value = ''
            inputEmail.value = ''
            phoneInput.value = ''
            modal('text', 'Спасибо за покупку)')
        } else {
            if (inputCheck.checked === false) {createAlertWindow('Вам нужно согласиться с пользовательским соглашением', 10000)} 
            else if (inputEmail.value.length < 3) {createAlertWindow('В поле E-mail должно быть больше 3 символов', 10000)} 
            else if (inputEmail.value.includes('@') === false) {createAlertWindow('В поле E-mail должен быть @', 10000)}
            else if (inputEmail.value.includes('.') === false) {createAlertWindow('В поле E-mail должна быть .', 10000)}
            else if (phoneInput.value.length != 16) {createAlertWindow('Поле телефона не соответствует (+7 ... ... .. ..)', 10000)}
        }
    })
}




function createList(id, list, func) {
    const domList = document.getElementById(id)
    for (const item of list) {domList.append(func(item))}
}

function createCard(data, tag) {
    const cardCont = createElement('li', '', [`${tag}__item`])
    const card = createElement('article', '', ['card'])
    const cardImg = createElement('img', '', ['card__img'], {alt: data.title, src: `${data.img}.webp`})
    const cardTitle = createElement('h3', '', ['card__title'])
    cardTitle.append(createElement('span', data.title, ['card__title-sp']), createElement('span', data.model, ['card__title-sp']))
    const cardBuy = createElement('button', 'Купить', ['btn-reset', 'card__buy'])
    card.append(cardImg, cardTitle)
    const cardCount = createElement('h4', `${data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['card__count'])
    if (data.lastCount != undefined) {
        if (data.constrImg != undefined) {
            cardCont.classList.add('sale-big')
            const cardComm = createElement('img', '', ['card__comm'], {alt: 'Конструкция товара', src: `${data.constrImg}.webp`})
            card.append(cardComm)
        }
        const cardSale = createElement('span', `- ${(data.lastCount - data.count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`, ['card__sale'])
        const cardLastCount = createElement('h4', `${(data.lastCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['card__count'])
        const cardCounts = createElement('div', '', ['card__count-cont'])
        cardCounts.append(cardCount, cardLastCount)
        card.append(cardSale, cardCounts, cardBuy)
    } else {
        const cardRaiting = createElement('span', data.raiting, ['card__raiting'])
        card.append(cardRaiting, cardCount, cardBuy)
    }
    cardBuy.addEventListener('click', () => {
        setData('itemData', dataToJson(data))
        window.location.href = "item.html";
    })
    cardCont.append(card)
    return cardCont
}

function checkSales(cardList) {
    const salesList = document.getElementById('sales')
    for (const card of cardList) {
        if (card.lastCount != undefined) {
            salesList.append(createCard(card, 'sale'))
        } else {
            continue
        }
    }
}

function createPopular(count, list) {
    const popList = document.getElementById('popular-list')
    for (const card of list) {
        if (count != 0) {popList.append(createCard(card, 'popular')); count--}
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setData('lastPage', dataToJson(window.location.href))
    setData('itemData', dataToJson(''))
    checkSales(items)
    createPopular(8, items)
    createList('categories-list', categories, createCategoriesItem)
    formFunc()
    searchForm()
    createIcon()
})