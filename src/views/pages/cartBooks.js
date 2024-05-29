import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'


class CartBooksView {
  init(){
    document.title = 'Books in cart'    
    this.caBooks = null
    this.render()    
    Utils.pageIntroAnim()
    this.getCaBooks()
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
  
  render(){
    
    const template = html`
     <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">     
           
        <h1>cart books</h1>
        
          <div class="books-grid">
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


export default new CartBooksView()