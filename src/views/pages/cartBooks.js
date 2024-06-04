import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'


class CartBooksView {
  async init(){
    document.title = 'Books in cart'    
    this.caBooks = null
    this.render()    
    Utils.pageIntroAnim()
    await this.getCaBooks()
    await this.calculateTotal(); // run calc total after getting books 
    this.displayBookSummaries();
  }

  async getCaBooks(){
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id)
      this.caBooks = currentUser.cartBooks
      console.log(this.caBooks)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  
  async calculateTotal() {
    // get book-card
    const books = document.querySelectorAll('.book-card'); 
    // set total at 0
    let total = 0; 

    // (forEach executes this for every book in the cart)
    books.forEach(book => {
      // get price from book-card data
      const price = parseFloat(book.getAttribute('price')); 
      if (!isNaN(price)) { // check if price is valid
        total += price; // adds price to the total
      }
    });
    // add total to the DOM as text 
    document.getElementById('total-price').textContent = total.toFixed(2); 
  }

  // book summaries
  displayBookSummaries() {
    // get book card 
    const books = document.querySelectorAll('.book-card');
    // create div to contain the summaries
    const summaryContainer = document.createElement('div');
    // add class for styling
    summaryContainer.classList.add('book-summaries');


    books.forEach(book => {
      // get attributes from each book-card
      const name = book.getAttribute('name');
      const author = book.getAttribute('author');
      const price = book.getAttribute('price');

      // create new summary for every card
      const bookSummary = document.createElement('div');
      bookSummary.classList.add('book-summary');
      // div structure with added info 
      bookSummary.innerHTML = `
        <p> ${name}<br><span> ${author}</span></p>
        <p> ${price}.00</p>
      `;
      // append each div to summaryContainer
      summaryContainer.appendChild(bookSummary);
    });

    // append summaryContainer to the DOM
    document.querySelector('.summaries').appendChild(summaryContainer);
  }
  
  render(){
    
    const template = html`
     <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content cart-page">     
        <div class="cart-total-flex">
          <div class="cart-books-section">
            <h1>YOUR ITEMS</h1>
              <div class="books-grid cart-grid">
                ${this.caBooks == null ? html`
                  <sl-spinner></sl-spinner>
                ` : html`
                  ${this.caBooks.map(book => html`
                    <va-book class="book-card"
                      id="${book._id}"
                      name="${book.name}"
                      author="${book.author}"
                      description="${book.description}"
                      price="${book.price}"
                      user="${JSON.stringify(book.user)}"
                      image="${book.image}"
                      condition="${book.condition}"
                      coverType="${book.coverType}"
                      year="${book.year}"
                      genre="${book.genre}"
                    >        
                    </va-book>

                  `)}
                `}
              </div>

          </div>
          <div class="total-section">
            <h2>ITEM TOTAL</h2>
            <div class="summaries"></div>
            <div class="total">Total <span id="total-price"></span></div>
          </div>
        </div>


      </div>     
      <div class="checkout-section">
              <sl-button class="checkout-btn">GO TO CHECKOUT</sl-button>
            </div> 
    `
    render(template, App.rootEl)
  }
}


export default new CartBooksView()