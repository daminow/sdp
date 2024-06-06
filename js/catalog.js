import { items, createElement, dataToJson, jsonToData, getData, setData, createIconItem, createIcon, createAlertWindow, checkValidInput } from './data.js'

function createFiltrItem(data) {
    if (data.arr.length === 0) { return }
    let pageTags = jsonToData(getData('pageTags'))
    if (pageTags === undefined || pageTags === null) {
        setData('pageTags', dataToJson([]))
        pageTags = jsonToData(getData('pageTags'))
    }
    const tag = 'filtr__var'
    const itemCont = createElement('div', '', [tag])
    const itemTitle = createElement('h2', data.name, [`${tag}-title`])
    const itemList = createElement('ul', '', ['list-reset', `${tag}-list`])
    for (const itemData of data.arr) {
        let tagItem = `${tag}-item`
        const itemId = `${itemData.value}`
        const itemParCont = createElement('li', '', [tagItem])
        const itemParCheckbox = createElement('input', '', [`${tagItem}-check`], { type: 'checkbox', id: itemId })
        const itemParLabel = createElement('label', itemData.name, [`${tagItem}-label`])
        itemParLabel.htmlFor = itemId
        itemParCont.append(itemParCheckbox, itemParLabel)
        itemList.append(itemParCont)
        let checkStatus = pageTags.includes(itemId)
        if (checkStatus) { itemParCheckbox.checked = true }
        itemParCheckbox.addEventListener('change', () => {
            pageTags = jsonToData(getData('pageTags'))
            if (itemParCheckbox.checked) {
                pageTags.push(itemId)
                setData('pageTags', dataToJson(pageTags))
                filtrItems()
            } else {
                pageTags.splice(pageTags.indexOf(itemId), 1)
                setData('pageTags', dataToJson(pageTags))
                filtrItems()
            }
        })
    }
    itemCont.append(itemTitle, itemList)
    return itemCont
}

function createItemPrice(tag, type, val) {
    const item = createElement('input', '', [`${tag}-input`], { id: `catalog-price-${type}`, min: '0', type: 'number' })
    item.value = val
    item.addEventListener('input', () => {
        if (item.value < 0) { item.value = 0 }
        if (type === 'end') { item.value = val }
    })
    return item
}

function createPriceItem(min, max) {
    const tag = 'filtr__price'
    const itemCont = createElement('div', '', [tag], { id: 'filtr-price' })
    const itemTitle = createElement('h3', 'Цена', [`${tag}-title`])
    const itemList = createElement('div', '', ['list-reset', `${tag}-var`])
    const itemStart = createElement('span', 'от', [`${tag}-text`])
    const itemEnd = createElement('span', 'до', [`${tag}-text`])
    const inputStart = createItemPrice(tag, 'start', min)
    const inputEnd = createItemPrice(tag, 'end', max)
    inputStart.addEventListener('input', () => {
        if (inputStart.value > inputEnd.value || inputStart.value === inputEnd.value) {
            inputEnd.value = Number(inputStart.value)
        }
    })
    itemList.append(itemStart, inputStart, itemEnd, inputEnd)
    itemCont.append(itemTitle, itemList)
    return itemCont
}
function filtrItems() {
    let datas = []
    let productsPerPage = 0
    if (window.innerWidth < 921) { productsPerPage = 6 }
    else { productsPerPage = 9 }

    let pageTags = jsonToData(getData('pageTags'))
    if (pageTags.length === 0) {
        processPage(productsPerPage, items)
        return
    }
    for (const item of items) {
        let countOfChecked = 0
        for (const iterator of item.tag) {
            if (pageTags.includes(iterator.value)) { countOfChecked++ }
        }
        if (countOfChecked === pageTags.length) { datas.push(item) }
    }
    processPage(productsPerPage, datas)
}

function createPageBtn(num) {
    const btn = createElement('button', num, ['btn-reset', 'pages__btn'])
    if (num === 1) { btn.classList.add('pages__active') }
    btn.addEventListener('click', () => {
        var lastPage = document.querySelector('.pages__active')
        lastPage.classList.remove('pages__active')
        lastPage = Number(lastPage.textContent)
        const searchOpenAnim = gsap.timeline()
            .pause()
            .fromTo(`#page-${lastPage}`, { opacity: 1 }, { opacity: 0, duration: .1 })
            .set(`#page-${lastPage}`, { display: 'none' })
            .set(`#page-${num}`, { display: 'grid' })
            .fromTo(`#page-${num}`, { opacity: 0 }, { opacity: 1, duration: .1 })
        searchOpenAnim.play()
        btn.classList.add('pages__active')
    })
    return btn
}

function processPage(productsPerPage, items) {
    gsap.fromTo('.filtr', { opacity: 1 }, { opacity: 0, duration: .1 })
    gsap.fromTo('.content', { opacity: 1 }, { opacity: 0, duration: .1 })
    setTimeout(() => {
        let minCount = 1000000
        let maxCount = 0
        let category = [
            {
                name: 'Цвет',
                value: 'color',
                arr: []
            },
            {
                name: 'Материал',
                value: 'material',
                arr: []
            },
            {
                name: 'Категория',
                value: 'category',
                arr: []
            },
        ]
        const content = document.querySelector('.content__list')
        const btnList = document.querySelector('.pages')
        btnList.innerHTML = ''
        content.innerHTML = ''

        let pageCount = 1
        let pageItemsCount = 0
        let page = createElement('li', '', ['content__page'], { id: `page-${pageCount}` })
        content.append(page)

        let searchText = jsonToData(getData('searchData'))
        if (searchText != null) {
            const input = document.getElementById('search-input')
            input.value = searchText
            localStorage.removeItem('searchData')
            let searchFilItems = []
            searchText = String(searchText).toLowerCase()
            for (const item of items) {
                if (String(item.model).toLowerCase().includes(searchText) || String(item.title).toLowerCase().includes(searchText)) {
                    searchFilItems.push(item)
                }
            }
            if (searchFilItems.length === 0) { input.value = '' }
            else { items = searchFilItems }
        }
        for (const product of items) {
            if (pageItemsCount >= productsPerPage) {
                pageCount++
                page = createElement('li', '', ['content__page'], { id: `page-${pageCount}` })
                content.append(page)
                btnList.append(createPageBtn(pageCount))
                pageItemsCount = 0
            }
            if (product.count > maxCount) { maxCount = product.count }
            if (product.count < minCount) { minCount = product.count }
            pageItemsCount++
            page.append(createCard(product))
            // Категории
            for (const tagItem of product.tag) {
                for (const categItem of category) {
                    if (tagItem.type === categItem.value) {
                        if (categItem.arr.length === 0) {
                            categItem.arr.push(tagItem)
                            continue
                        }
                        let flag = false
                        for (const item of categItem.arr) {
                            if (item.value === tagItem.value) {
                                flag = true
                                break
                            }
                        }
                        if (flag === false) { categItem.arr.push(tagItem) }
                    }
                }
            }
        }
        // Фильтр
        const filtrCont = document.querySelector('.filtr')
        filtrCont.innerHTML = ''
        const filtrTitle = createElement('h2', 'Фильтровать по:', ['filtr__title'])
        filtrCont.append(filtrTitle)
        for (const categ of category) {
            if (categ.arr.length > 0) { filtrCont.append(createFiltrItem(categ)) }
        }

        if (pageCount > 1) { btnList.prepend(createPageBtn(1)) }
        if (document.getElementById('page-1').childNodes.length > 1) {
            filtrCont.append(createPriceItem(minCount, maxCount))
        }
    }, 300)
    setTimeout(() => {
        gsap.fromTo('.filtr', { opacity: 0 }, { opacity: 1, duration: .1 })
        gsap.fromTo('.content', { opacity: 0 }, { opacity: 1, duration: .1 })
    }, 300)
}

function createCard(data) {
    const cardCont = createElement('div', '', [`content__item`])
    const card = createElement('article', '', ['card'])
    const cardRaiting = createElement('span', data.raiting, ['card__raiting'])
    const cardImg = createElement('img', '', ['card__img'], { alt: data.title, src: `${data.img}.webp` })
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
    } else { card.append(cardCount, cardBuy) }
    cardBuy.addEventListener('click', () => {
        setData('itemData', dataToJson(data))
        window.location.href = "item.html";
    })
    cardCont.append(card)
    return cardCont
}

function renderPage() {
    let productsPerPage = 0
    if (window.innerWidth < 921) { productsPerPage = 6 }
    else { productsPerPage = 9 }
    processPage(productsPerPage, items)
}

function searchForm() {
    const input = document.getElementById('search-input')
    const submitBtn = document.getElementById('search-submit')
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault()
        if (input.value.length < 2) {
            createAlertWindow('Поле поиска должно содержать более двух символов!', 5000)
            return
        }
        setData('searchData', dataToJson(input.value))
        renderPage()
    })
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value.length <= 1) {
            setData('searchData', dataToJson(''))
            renderPage()
        }
    })
}

window.addEventListener('resize', (event) => {
    let pageTags = jsonToData(getData('pageTags'))
    if (pageTags === null) {
        setData('pageTags', dataToJson([]))
        pageTags = jsonToData(getData('pageTags'))
        renderPage()
        return
    }
    filtrItems()
})

document.addEventListener('DOMContentLoaded', () => {
    setData('lastPage', dataToJson(window.location.href))
    setData('itemData', dataToJson(''))
    let pageTags = jsonToData(getData('pageTags'))
    if (pageTags === null) {
        setData('pageTags', dataToJson([]))
        pageTags = jsonToData(getData('pageTags'))
        renderPage()
        return
    }
    filtrItems()
    searchForm()
    createIcon()
})