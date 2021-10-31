import items from './items.json'
import formatCurrency from './util/formatCurrency'
import { addToCart } from './shoppingCart.js'
import addGlobalEventListener from './util/addGlobalEventListener.js'
import picture from './media/store/item-3.jpg'

const storeItemTemplate = document.querySelector("#store-item-template")
const storeItemContainer = document.querySelector("[data-store-container]")
const IMAGE_URL = "https://dummyimage.com/420x260"


console.log(items)

export function setUpStore() {
    //exit all store setups if not having any elements
    if (storeItemContainer == null) return

    addGlobalEventListener("click", "[data-add-to-cart-button]", e => {
        const id = e.target.closest("[data-store-item]").dataset.itemId
        addToCart(parseInt(id))
    })

    items.forEach(renderStoreItem)
}


function renderStoreItem(item) {
    //get all content inside the template
    const storeItem = storeItemTemplate.content.cloneNode(true)
    //getting the elements by data-attributes
    const container  = storeItem.querySelector("[data-store-item]")
    //setting the id of each individual item to the dataset itemid
    container.dataset.itemId = item.id
    //following logic for the rest data-attributes
    const name = storeItem.querySelector("[data-name]")
    name.innerText = item.name

    const category = storeItem.querySelector("[data-category]")
    category.innerText = item.category

    const image = storeItem.querySelector("[data-image]")
    image.src = item.imageColor

    const price = storeItem.querySelector("[data-price]")
    price.innerText = formatCurrency(item.priceCents / 100)

    //append children to the itemContainer
    storeItemContainer.appendChild(storeItem)
}
