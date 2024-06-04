import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'

class FavouriteBooks2View {
  init(){
    document.title = 'Favourite Books'    
    this.cartBooks = null
    this.render()    
    Utils.pageIntroAnim()
    this.getCartBooks()
  }
  async getCartBooks(){
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id)
      this.cartBooks = currentUser.cartBooks
      console.log(this.cartBooks)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  
  render(){
    const template = html`
      <va-app-header title="Cart Books" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>ca books</h1>
        
          <div class="books-grid">
            ${this.cartBooks == null ? html`
              <sl-spinner></sl-spinner>
            ` : html`
              ${this.cartBooks.map(book => html`
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


export default new FavouriteBooks2View()