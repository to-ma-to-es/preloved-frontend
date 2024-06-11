import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'

class FavouriteBooksView {
  init(){
    document.title = 'My Wishlist'    
    this.favBooks = null
    this.render()    
    Utils.pageIntroAnim()
    this.getFavBooks()
  }

  /* Get User's Wishlisted Books */
  async getFavBooks(){
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id)
      this.favBooks = currentUser.favouriteBooks
      console.log(this.favBooks)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  
  render(){
    const template = html`
      <va-app-header title="Fav Books" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content wishlist-page">        
        <h1>WISHLIST</h1>
          <div class="books-grid">
            ${this.favBooks == null ? html`
              <sl-spinner></sl-spinner>
            ` : html`
              ${this.favBooks.map(book => html`
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
    `
    render(template, App.rootEl)
  }
}


export default new FavouriteBooksView() 