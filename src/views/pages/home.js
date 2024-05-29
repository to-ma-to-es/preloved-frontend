import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import BookAPI from '../../BookAPI'
import Toast from '../../Toast'

class HomeView {
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

    // condition
    if(field == 'condition'){
      filteredBooks = this.books.filter(book => book.condition == match)
    }

    // cover type
    if(field == 'coverType'){
      filteredBooks = this.books.filter(book => book.coverType == match)
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
            <strong>Condition</strong>
            <sl-button class="filter-btn" size="small" data-field="condition" data-match="fair" @click=${this.handleFilterBtn.bind(this)}>Fair</sl-button>
            <sl-button class="filter-btn" size="small" data-field="condition" data-match="good" @click=${this.handleFilterBtn.bind(this)}>Good</sl-button>
            <sl-button class="filter-btn" size="small" data-field="condition" data-match="excellent" @click=${this.handleFilterBtn.bind(this)}>Excellent</sl-button>
          </div>
          <div>
            <strong>Cover Type</strong>
            <sl-button class="filter-btn" size="small" data-field="coverType" data-match="paperback" @click=${this.handleFilterBtn.bind(this)}>Paperback</sl-button>
            <sl-button class="filter-btn" size="small" data-field="coverType" data-match="hardcover" @click=${this.handleFilterBtn.bind(this)}>Hardcover</sl-button>
          </div>
          <div>
            <strong>Price</strong>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="1-5" @click=${this.handleFilterBtn.bind(this)}>$1-$5</sl-button>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="6-10" @click=${this.handleFilterBtn.bind(this)}>$6-$10</sl-button>
            <sl-button class="filter-btn" size="small" data-field="price" data-match="11-15" @click=${this.handleFilterBtn.bind(this)}>$11-$15</sl-button>
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
              author="${book.author}"
              description="${book.description}"
              price="${book.price}"
              user="${JSON.stringify(book.user)}"
              image="${book.image}"
              condition="${book.condition}"
              coverType="${book.coverType}"
              year="${book.year}">

          </va-book>
          `)}
          `}
        </div>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}

export default new HomeView()