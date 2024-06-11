import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import BookAPI from '../../BookAPI'
import Toast from '../../Toast'


class HomeView {
  async init(){
    document.title = 'Preloved Books'
    this.books = null
    this.render()    
    Utils.pageIntroAnim()
    await this.getBooks()
  }
 
  /* Filter Function */
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

      // genre
      if(field == 'genre'){
        filteredBooks = this.books.filter(book => book.genre == match)
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

  /* Clear Filter when not active */
  clearFilterBtns() {
        // reset all btns (clear all active states of filter btns)
        const filterBtns = document.querySelectorAll('.filter-btn')
        filterBtns.forEach(btn => btn.removeAttribute("variant"))
  }

  /* Show Active Filter (one at a time) */
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

  /* Clear All Filters */
  clearFilters(){
    this.getBooks()
    this.clearFilterBtns()
  }

  /* Get All Books */
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
      <va-app-header title="Books" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">
        <div class="banner">15% of Your Purchases Goes to Trillion Trees Australia!</div>
        <div class="book-of-the-day-parent">
          <div class="book-of-the-day">
            <img class="botd-image" src="/images/citrus-county.jpg" alt="Book Cover illustration of boy with hand covering face">
            <div class="botd-information">
              <h1>BOOK OF THE DAY</h1>
              <h2>Citrus County by John Brandon &nbsp; <span>$10.00<span></h2>
              <p>"There shouldn’t be a Citrus County. Teenage romance should be difficult, but not this difficult. Boys like Toby should cause trouble but not this much. The moon should glow gently over children safe in their beds..." </p>
              <sl-button class="botd-btn">CHECK IT OUT</sl-button>
            </div>
          </div>
        </div>     
        <div class="filter-and-books-parent">
          <div class="filter-menu">
            <sl-input class="search-bar" placeholder="Search Books/Authors"><sl-icon name="search" slot="prefix"></sl-icon></sl-input>
            <div class="filter-header">
              Filters 
              <i class="fa-solid fa-filter"></i>
            </div>
            <div class="btn-container">
              <strong>Genre</strong>
              <sl-button class="filter-btn" size="small" data-field="genre" data-match="australiana" @click=${this.handleFilterBtn.bind(this)}>Australiana</sl-button>
              <sl-button class="filter-btn" size="small" data-field="genre" data-match="children" @click=${this.handleFilterBtn.bind(this)}>Children's Books</sl-button>
              <sl-button class="filter-btn" size="small" data-field="genre" data-match="educational" @click=${this.handleFilterBtn.bind(this)}>Educational</sl-button>
              <sl-button class="filter-btn" size="small" data-field="genre" data-match="fiction" @click=${this.handleFilterBtn.bind(this)}>Fiction</sl-button>
              <sl-button class="filter-btn" size="small" data-field="genre" data-match="philosophy" @click=${this.handleFilterBtn.bind(this)}>Philosophy</sl-button>
            </div>
            <div class="btn-container">
              <strong>Condition</strong>
              <sl-button class="filter-btn" size="small" data-field="condition" data-match="fair" @click=${this.handleFilterBtn.bind(this)}>Fair</sl-button>
              <sl-button class="filter-btn" size="small" data-field="condition" data-match="good" @click=${this.handleFilterBtn.bind(this)}>Good</sl-button>
              <sl-button class="filter-btn" size="small" data-field="condition" data-match="excellent" @click=${this.handleFilterBtn.bind(this)}>Excellent</sl-button>
            </div>
            <div class="btn-container">
              <strong>Cover Type</strong>
              <sl-button class="filter-btn" size="small" data-field="coverType" data-match="paperback" @click=${this.handleFilterBtn.bind(this)}>Paperback</sl-button>
              <sl-button class="filter-btn" size="small" data-field="coverType" data-match="hardcover" @click=${this.handleFilterBtn.bind(this)}>Hardcover</sl-button>
            </div>
            <div class="btn-container">
              <strong>Price</strong>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="1-5" @click=${this.handleFilterBtn.bind(this)}>$1-$5</sl-button>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="6-10" @click=${this.handleFilterBtn.bind(this)}>$6-$10</sl-button>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="11-15" @click=${this.handleFilterBtn.bind(this)}>$11-$15</sl-button>
            </div>       
            <div class="btn-container">
              <sl-button class="clear-filter-btn"size="small" @click=${this.clearFilters.bind(this)}>Clear Filters</sl-button>
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
                year="${book.year}"
                genre="${book.genre}">
              </va-book>
            `)}
            `}
          </div>
        </div>
      </div>      
    `
    render(template, App.rootEl)
  }
}

export default new HomeView()