import {items, createElement, dataToJson, jsonToData, getData, setData, createIconItem, createIcon, createAlertWindow, searchForm, modal} from './data.js'
function createInfo(data) {
    const cont = document.getElementById('product-info')
    const img = document.getElementById('product-img')
    img.src = `${data.img}.webp`
    const raiting = createElement('span', data.raiting, ['product__info-raiting'])
    const title = createElement('h1', data.title + ' ' + data.model, ['product__info-title'])
    const descr = createElement('p', 'Мини 120 см без ящика Stark синий (Рогожка)', ['product__info-descr'])
    const price = createElement('h2', `${(data.count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['product__info-price'])
    const buyNow = createElement('button', 'Купить в один клик', ['btn-reset', 'product__info-buynow'])
    const addBusket = createElement('button', '+ Добавить в корзину', ['btn-reset', 'product__info-busket'])
    addBusket.addEventListener('click', ()=> {
        let lastItems = jsonToData(getData('busket'))
        lastItems.push(data)
        setData('busket', dataToJson(lastItems))
        createIcon()
    })
    buyNow.addEventListener('click', ()=> {
        let lastItems = jsonToData(getData('busket'))
        lastItems.push(data)
        setData('busket', dataToJson(lastItems))
        createIcon()
        modal('buynow', jsonToData(getData('busket')))
    })
    if (data.lastCount === undefined) {cont.append(raiting, title, descr, price, buyNow, addBusket)} 
    else {
        const priceCont = createElement('div', '', ['product__info-price-cont'])
        priceCont.append(price, createElement('h2', `${data.lastCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['product__info-price']))
        cont.append(raiting, title, descr, priceCont, buyNow, addBusket)
    }
}

function createAnother(array, itemData) {
    const randomElements = [];
    while (randomElements.length < 4) {
        const randomIndex = Math.floor(Math.random() * array.length);
        if (array[randomIndex] != itemData) {
            randomElements.push(array[randomIndex]);
            array.splice(randomIndex, 1);
        }
    }
    const cardList = document.getElementById('another-list')
    for (const elem of randomElements) {cardList.append(createCard(elem))}
}

function createCard(data) {
    const cardCont = createElement('li', '', [`another__item`])
    const card = createElement('article', '', ['card'])
    const cardRaiting = createElement('span', data.raiting, ['card__raiting'])
    const cardImg = createElement('img', '', ['card__img'], {alt: data.title, src: `${data.img}.webp`})
    const cardTitle = createElement('h3', '', ['card__title'])
    cardTitle.append(createElement('span', data.title, ['card__title-sp']), createElement('span', data.model, ['card__title-sp']))
    const cardBuy = createElement('button', 'Купить', ['btn-reset', 'card__buy'])
    card.append(cardRaiting, cardImg, cardTitle)
    const cardCount = createElement('h4', `${data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['card__count'])
    if (data.lastCount != undefined) {
        const cardLastPrice = createElement('h4', `${(data.lastCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб`, ['card__count'])
        const cardCounts = createElement('div', '', ['card__count-cont'])
        cardCounts.append(cardCount, cardLastPrice)
        card.append(cardCounts, cardBuy)
    } 
    else {card.append(cardCount, cardBuy)}
    cardBuy.addEventListener('click', () => {
        setData('itemData', dataToJson(data))
        window.location.href = "item.html";
    })
    cardCont.append(card)
    return cardCont
}

document.addEventListener('DOMContentLoaded', ()=>{
    let itemData = jsonToData(getData('itemData'))
    searchForm()
    if (itemData != null || itemData != undefined) {
        createInfo(itemData)
        createAnother(items, itemData)
        const varCont = document.getElementById('variations')
        const varLink = createElement('li', '', ['variations__item'])
        const varA = createElement('a', itemData.model, [], {href: "item.html"})
        varLink.append(varA)
        varCont.append(varLink)
        createIcon()
    } else {
        window.location.href = jsonToData(getData('lastPage'));
    }
})