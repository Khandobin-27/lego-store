import items from './items.json'
import formatCurrency from './util/formatCurrency.js'
import addGlobalEventListener from './util/addGlobalEventListener.js'

//Main task plan
//1. Add items to cart
//2. Remove items from cart
//3. Show/Hide the cart when clicked
//4. Show/Hide the cart button when it has no items or when it
//has its first item
//5. Persist across multiple pages (save data in the session storage)
//6. Calculate the accurate total
//7. Handle multiple of the same item in the cart


const cartButton = document.querySelector("[data-cart-button]")
const cartItemsWrapper = document.querySelector("[data-cart-items-wrapper]")
let shoppingCart = []
const cart = document.querySelector("[data-cart]")
const IMAGE_URL = "https://dummyimage.com/210x130"
const cartItemTemplate = document.querySelector("#cart-item-template")
const cartItemContainer = document.querySelector("[data-cart-items]")
const cartQuantity = document.querySelector("[data-cart-quantity]")
const cartTotal = document.querySelector("[data-cart-total]")
const SESSION_STORAGE_KEY = "SHOPPING_CART-cart"

export function setUpShoppingCart() {
    //2 event listener for removing the cart
    addGlobalEventListener("click", "[data-remove-from-cart-button]", e => {
        const id = parseInt(e.target.closest("[data-item]").dataset.itemId)
        removeFromCart(id)
      })
    //assging this array here and not on the top where it was declared
    //becasue otherwise it will not see session storage changes 
    //and going to return null
    shoppingCart = loadCart()
    renderCart()
    //3
    cartButton.addEventListener('click', () => {
        cartItemsWrapper.classList.toggle('invisible')
    })
}

//5
function saveCart() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
  }
  
  function loadCart() {
    const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return JSON.parse(cart) || []
  }

//1 
//handle click event for adding
export function addToCart(id) {
    //7
    //check if the same item already in the cart to not add additional section
    const existingItem = shoppingCart.find(entry => entry.id === id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      shoppingCart.push({ id: id, quantity: 1 })
    }
    renderCart()
    saveCart()
  }

//2
function removeFromCart(id) {
    const existingItem = shoppingCart.find(entry => entry.id === id)
    if (existingItem == null) return
    shoppingCart = shoppingCart.filter(entry => entry.id !== id)
    renderCart()
    saveCart()
  }

//4
  function renderCart() {
    if (shoppingCart.length === 0) {
      hideCart()
    } else {
      showCart()
      renderCartItems()
    }
  }

  function hideCart() {
    cart.classList.add("invisible")
    //to show only cart logo without the expanded items list
    cartItemsWrapper.classList.add("invisible")
  }
  
  function showCart() {
    cart.classList.remove("invisible")
  }

  //html template of the cart items to dynamic form 
  function renderCartItems() {
    //adding number of items in the red circle of the cart logo
    cartQuantity.innerText = shoppingCart.length
  
    //6 (calcualting total)
    const totalCents = shoppingCart.reduce((sum, entry) => {
      const item = items.find(i => entry.id === i.id)
      return sum + item.priceCents * entry.quantity
    }, 0)
  
    cartTotal.innerText = formatCurrency(totalCents / 100)
  
    cartItemContainer.innerHTML = ""
    shoppingCart.forEach(entry => {
      const item = items.find(i => entry.id === i.id)
      const cartItem = cartItemTemplate.content.cloneNode(true)
  
      const container = cartItem.querySelector("[data-item]")
      container.dataset.itemId = item.id
  
      const name = cartItem.querySelector("[data-name]")
      name.innerText = item.name
  
      const image = cartItem.querySelector("[data-image]")
      image.src = item.imageColor
  
      if (entry.quantity > 1) {
        const quantity = cartItem.querySelector("[data-quantity]")
        quantity.innerText = `x${entry.quantity}`
      }
  
      const price = cartItem.querySelector("[data-price]")
      price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100)
  
      cartItemContainer.appendChild(cartItem)
    })
  }