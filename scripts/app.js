const cards = document.getElementById('cards');
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-cart').content;
const footer = document.getElementById('footer');
const fragment = document.createDocumentFragment();
let cart = {};

// El DOMContentLoaded se dispara cuando todo mi document ha sido cargado y parseado
document.addEventListener('DOMContentLoaded', (e) => {  
  fetchData();
  // if (localStorage.getItem('car')) {
  //   cart = JSON.parse(localStorage.getItem('car'))
  //   renderCart();
  // }
});

cards.addEventListener('click', e =>{
  addToCart(e)
})
items.addEventListener('click', e=>{
  btnAction(e);
});


const fetchData = async () => {
  try {
    const response = await fetch("/scripts/instruments.json")
    const data = await response.json()
    // console.log(data);
    renderCards(data);
  } catch (error) {
      console.log(error);
  }
}

const renderCards = data => {
  data.forEach(instrument=>{
    templateCard.querySelector('h4').textContent = instrument.title;
    templateCard.querySelector('p').textContent = instrument.price;
    templateCard.querySelector('img').setAttribute('src',instrument.img);
    templateCard.querySelector('img').setAttribute('alt',instrument.title);
    templateCard.querySelector('.btn-dark').dataset.id = instrument.id;
    const cloneTemplate = templateCard.cloneNode(true);
    fragment.appendChild(cloneTemplate);
  })
  cards.appendChild(fragment);
}

const addToCart=(e)=>{
  // console.log(e.target);
  // console.log(e.target.classList.contains('btn-dark'));
  if (e.target.classList.contains('btn-dark')) {
    // console.log(e.target.parentElement);
    setCart(e.target.parentElement);    
  }
  e.stopPropagation();
}

const setCart = element => {
  // console.log(element);
  const product = {
    id: element.querySelector('.btn-dark').dataset.id,
    title: element.querySelector('h4').textContent,
    price: element.querySelector('p').textContent,
    quantity: 1
  }

  if(cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1
  }

  cart[product.id] = {...product}; 
  
  renderCart();
  console.log(product);  
  console.log(cart);  
  console.log(cart[product.id]);
}

const renderCart = () => {

  // console.log(Object.values(cart));
  items.innerHTML = '';

  Object.values(cart).forEach(instrument => {
    
    templateCart.querySelector('th').textContent = instrument.id;
    templateCart.querySelectorAll('td')[0].textContent = instrument.title;
    templateCart.querySelectorAll('td')[1].textContent = instrument.quantity;
    templateCart.querySelector('span').textContent = instrument.quantity * instrument.price;
    
    templateCart.querySelector('.btn-info').dataset.id = instrument.id;
    templateCart.querySelector('.btn-danger').dataset.id = instrument.id;

    const cloneTemplate = templateCart.cloneNode(true);
    fragment.appendChild(cloneTemplate);
  })
  items.appendChild(fragment);

  renderFooter();

  // localStorage.setItem('car', JSON.stringify(cart))
}

const renderFooter = () => {

  footer.innerHTML = '';

  if (Object.keys(cart).length === 0 ) {
    footer.innerHTML = `<th scope="row" colspan="5">¡¡¡Empty Cart!!!</th>`
    // El return se coloca para que la función no se siga ejecutando
    return
  }
  const nQuantity = Object.values(cart).reduce((acum,{quantity})=>acum + quantity,0)
  // console.log(nQuantity);
  const nPrice = Object.values(cart).reduce((acum,{quantity,price})=>acum + (price*quantity),0)
  // console.log(nPrice);

  templateFooter.querySelectorAll('td')[0].textContent = nQuantity;
  templateFooter.querySelector('span').textContent = nPrice;

  const cloneTemplate = templateFooter.cloneNode(true);
  fragment.appendChild(cloneTemplate);
  footer.appendChild(fragment);

  const btnClear = document.getElementById('vaciar-carrito');
  btnClear.addEventListener('click',()=>{
    cart = {};
    renderCart();
  });
}

const btnAction=(e)=> {

  if (e.target.classList.contains('btn-info')) {
   const product = cart[e.target.dataset.id];
   product.quantity++;
   cart[e.target.dataset.id] = {...product};
   renderCart();
  }

  if (e.target.classList.contains('btn-danger')) {
    const product = cart[e.target.dataset.id];
    product.quantity--;
    if (product.quantity === 0) {
     delete cart[e.target.dataset.id]
    } else {
      cart[e.target.dataset.id] = {...product};
    }
    renderCart();
  }
  e.stopPropagation();
}