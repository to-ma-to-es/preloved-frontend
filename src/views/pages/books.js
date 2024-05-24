import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import BookAPI from '../../BookAPI'
import Toast from '../../Toast'

class BooksView {
  async init(){
    document.title = 'Books'
    this.books = null
    this.render()    
    Utils.pageIntroAnim()
    await this.getBooks()
   // this.filterBooks('price', '20-40')
  }

  async filterBooks(field, match){
    // validate, so if user not filtering, this fnc doesn't run
    if(!field || !match) return 

    // get fresh copy of books
    this.books = await BookAPI.getBooks()

    let filteredBooks

    // gender
    if(field == 'gender'){
      filteredBooks = this.books.filter(book => book.gender == match)
    }

    // length
    if(field == 'length'){
      filteredBooks = this.books.filter(book => book.length == match)
    }

    // price
    if(field == 'price'){
      // get priceRangeStart 
      const priceRangeStart = match.split('-')[0]
      // get priceRangeEnd
      const priceRangeEnd = match.split('-')[1]
      filteredBooks = this.books.filter(book => book.price >= priceRangeStart && book.price <= priceRangeEnd)
    }

    // render
    this.books = filteredBooks
    this.render()
  }

  clearFilterBtns() {
        // reset all btns (clear all active states of filter btns)
        const filterBtns = document.querySelectorAll('.filter-btn')
        filterBtns.forEach(btn => btn.removeAttribute("variant"))
  }

  handleFilterBtn(e){
    // reset all btns (clear all active states of filter btns)
    this.clearFilterBtns()
    //set btn active
    e.target.setAttribute("variant", "primary")

    // extract field and match
    const field = e.target.getAttribute("data-field")
    const match = e.target.getAttribute("data-match")

    // filter books 
    this.filterBooks(field, match)
  }

  clearFilters(){
    this.getBooks()
    this.clearFilterBtns()
  }

  async getBooks(){
    try{
      this.books = await BookAPI.getBooks()
      console.log(this.books)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  render(){
    const template = html`
    <style>
      .filter-menu {
        display: flex;
        align-items: center;
      }

      .filter-menu > div {
        margin-right: 1em;
      }

    </style>
      <va-app-header title="Books" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">       
        <div class="filter-menu">
          <div>
            Filter by
          </div>
          <div>
            <strong>Gender</strong>
            <sl-button class="filter-btn" size="small" data-field="gender" data-match="m" @click=${this.handleFilterBtn.bind(this)}>M</sl-button>
            <sl-button class="filter-btn" size="small" data-field="gender" data-match="f" @click=${this.handleFilterBtn.bind(this)}>F</sl-button>
            <sl-button class="filter-btn" size="small" data-field="gender" data-match="u" @click=${this.handleFilterBtn.bind(this)}>U</sl-button>
          </div>
          <div>
            <strong>Length</strong>
            <sl-button class="filter-btn" size="small" data-field="length" data-match="s" @click=${this.handleFilterBtn.bind(this)}>S</sl-button>
            <sl-button class="filter-btn" size="small" data-field="length" data-match="m" @click=${this.handleFilterBtn.bind(this)}>M</sl-button>
            <sl-button class="filter-btn" size="small" data-field="length" data-match="l" @click=${this.handleFilterBtn.bind(this)}>L</sl-button>
          </div>
          <div>
            <strong>Price</strong>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="10-20" @click=${this.handleFilterBtn.bind(this)}>$10-$20</sl-button>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="20-30" @click=${this.handleFilterBtn.bind(this)}>$20-$30</sl-button>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="30-40" @click=${this.handleFilterBtn.bind(this)}>$30-$40</sl-button>
          </div>

          <div>
            <sl-button size="small" @click=${this.clearFilters.bind(this)}>Clear Filters</sl-button>
          </div>
        </div> 

        <div class="books-grid"> 
          ${this.books == null ? html`
          <sl-spinner></sl-spinner>
          `: html`
          ${this.books.map(book => html`
            <va-book class="book-card" 
              id="${book._id}"
              name="${book.name}" 
              description="${book.description}"
              price="${book.price}"
              user="${JSON.stringify(book.user)}"
              image="${book.image}"
              gender="${book.gender}"
              length="${book.length}">

          </va-book>
          `)}
          `}
        </div>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}

// if else content is html``: html``
// img src="${App.apiBase}/images/${book.image}" is getting location of image
export default new BooksView()