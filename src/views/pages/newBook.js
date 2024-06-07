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
    this.setupEventListeners(); 
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

      // Reset image frame
      const frame = document.getElementById('frame');
      frame.src = ''; // Clear the src attribute
    }catch(err){
      Toast.show(err, 'error')
      submitBtn.removeAttribute('loading')
    }
    
  }

  // change preview when file is changed
  setupEventListeners() {
    const fileInput = document.querySelector('input[type=file]');
    if(fileInput) {
      fileInput.addEventListener('change', (event) => this.preview(event));
    }
  }

  // shows preview image 
  preview(event) {
    const frame = document.getElementById('frame'); // Get the img element
    frame.src = URL.createObjectURL(event.target.files[0]); // Set its src attribute
  }


  

  render(){
    const template = html`
      <va-app-header title="New Book" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content new-book-page">    

        <div class="add-listing-header">
            <h1>ADD BOOK LISTING</h1>
            <sl-icon  @click=${()=> gotoRoute('/profile')} class="x-lg" name="x-lg"></sl-icon>

        </div>
        <div class="center">
          <form class="page-form" @submit=${this.newBookSubmitHandler}>

            <div class="form-flex">
              <div class="input-group file-group">
                  <img id="frame" src=""/>
                  <label for="fileInput" class="custom-file-input" >Add Cover Image <i class="fa-solid fa-circle-plus"></i></label><br>
                  <input type="file" id="fileInput" onchange="preview(event)" name="image">    
                
                <input type="hidden" name="user" value="${Auth.currentUser._id}" />
                </div>
                
                <div class="text-inputs">
                  <div class="input-group">
                    <sl-input class="new-book-input" label="Title" name="name" type="text" placeholder="Enter Title" required></sl-input>
                  </div>
                  <div class="input-group">
                    <sl-input class="new-book-input" label="Author" name="author" type="text" placeholder="Enter Author" required></sl-input>
                  </div>    
                  <div class="input-group">
                    <sl-input class="new-book-input" label="Year" name="year" type="text" placeholder="Enter Year" required></sl-input>
                  </div>          
                  <div class="input-group">              
                    <sl-input class="new-book-input"label="Price" name="price" type="text" placeholder="Enter Price" required>
                      <span slot="prefix">$</span>
                    </sl-input>
                  </div>
                </div>    

                <div class="radio-inputs">
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
                    <sl-radio-group name="genre" label="Genre">
                      <sl-radio value="australiana">Australiana</sl-radio>
                      <sl-radio value="children">Children</sl-radio>
                      <sl-radio value="educational">Educational</sl-radio>
                      <sl-radio value="fiction">Fiction</sl-radio>
                      <sl-radio value="philosophy">Philosophy</sl-radio>
                    </sl-radio-group>
                  </div>
                </div>

            </div>
            <!-- Description -->   
            <div class="input-group" style="margin-bottom: 2em;">
              <sl-textarea class="book-description" name="description" rows="3" placeholder="Book Description"></sl-textarea>
            </div>  

            <sl-button class="add-btn">Add Another Listing <i class="fa-solid fa-circle-plus"></i></sl-button>
            <sl-button  type="submit" class="submit-btn listing-submit-btn">Post Book Listing</sl-button>
            
          </form>
        </div>
      </div>   
      

    `
    render(template, App.rootEl)
  }
}


export default new newBookView()