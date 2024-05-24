import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'

class FavouriteBooksView {
  init(){
    document.title = 'Favourite Books'    
    this.favBooks = null
    this.render()    
    Utils.pageIntroAnim()
    this.getFavBooks()
  }
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
      <div class="page-content">        
        <h1>fav books</h1>
        
          <div class="books-grid">
            ${this.favBooks == null ? html`
              <sl-spinner></sl-spinner>
            ` : html`
              ${this.favBooks.map(book => html`
                <va-book class="book-card"
                  id="${book._id}"
                  name="${book.name}"
                  description="${book.description}"
                  price="${book.price}"
                  user="${JSON.stringify(book.user)}"
                  image="${book.image}"
                  gender="${book.gender}"
                  length="${book.length}"
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