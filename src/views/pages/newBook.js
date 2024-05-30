import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import BookAPI from '../../BookAPI'
import Toast from '../../Toast'

class newBookView {
  init(){
    document.title = 'New Book'    
    this.render()    
    Utils.pageIntroAnim()
  }

  async newBookSubmitHandler(e){
    e.preventDefault() // stops refresh that happens on default
    const formData = new FormData(e.target)
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    
    try{
      await BookAPI.newBook(formData)
      Toast.show('Book added!')
      submitBtn.removeAttribute('loading')
      // reset form
      // text + text are fields
      const textInputs = document.querySelectorAll('sl-input, sl-textarea')
      if(textInputs) textInputs.forEach(textInput => textInput.value = null)

      // reset radio btns
      const radioInputs = document.querySelectorAll('sl-radio-group')
      if (radioInputs) radioInputs.forEach(radioInput => radioInput.value = null)

      // reset image input 
      const fileInput = document.querySelector('input[type=file]')
      if(fileInput) fileInput.value = null

    }catch(err){
      Toast.show(err, 'error')
      submitBtn.removeAttribute('loading')
    }
    
  }
  

  render(){
    const template = html`
      <va-app-header title="New Book" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>New Book</h1>

          <form class="page-form" @submit=${this.newBookSubmitHandler}>
            <input type="hidden" name="user" value="${Auth.currentUser._id}" />
            <div class="input-group">
              <sl-input name="name" type="text" placeholder="Book Title" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="author" type="text" placeholder="Author Name" required></sl-input>
            </div>            
            <div class="input-group">              
              <sl-input name="price" type="text" placeholder="Price" required>
                <span slot="prefix">$</span>
              </sl-input>
            </div>
            <div class="input-group">
              <sl-textarea name="description" rows="3" placeholder="Book Description"></sl-textarea>
            </div>
            <div class="input-group">
              <sl-input name="year" type="text" placeholder="Year" required></sl-input>
            </div>         
            <div class="input-group" style="margin-bottom: 2em;">
              <label>Image</label><br>
              <input type="file" name="image" />              
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <sl-radio-group name="condition" label="Condition">
                <sl-radio value="fair">Fair</sl-radio>
                <sl-radio value="good">Good</sl-radio>
                <sl-radio value="excellent">Excellent</sl-radio>
              </sl-radio-group>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              <sl-radio-group name="coverType" label="Cover Type">
                <sl-radio value="paperback">Paperback</sl-radio>
                <sl-radio value="hardcover">Hardcover</sl-radio>
              </sl-radio-group>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">

            <div class="input-group" style="margin-bottom: 2em;">
              <sl-radio-group name="genre" label="Genre">
                <sl-radio value="australiana">Australiana</sl-radio>
                <sl-radio value="children">Children</sl-radio>
                <sl-radio value="educational">Educational</sl-radio>
                <sl-radio value="fiction">Fiction</sl-radio>
                <sl-radio value="philosophy">Philosophy</sl-radio>
              </sl-radio-group>
            </div>
            <div class="input-group" style="margin-bottom: 2em;">
              

            </div>
            <sl-button variant="primary" type="submit" class="submit-btn">Add Book</sl-button>
          </form>

        <p>Page content ...</p>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new newBookView()