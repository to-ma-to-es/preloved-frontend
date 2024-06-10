import App from './../../App'
import Auth from './../../Auth'
import {html, render } from 'lit'
import {anchorRoute, gotoRoute} from './../../Router'
import Utils from './../../Utils'

class SignUpView{
   
  init(){      
    console.log('SignUpView.init')  
    document.title = 'Sign In'    
    this.render()
    Utils.pageIntroAnim()
  }

  signUpSubmitHandler(e){
    e.preventDefault()    
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    const formData = new FormData(e.target)
    
    // sign up using Auth
    Auth.signUp(formData, () => {
      submitBtn.removeAttribute('loading')
    })   
  }

  render(){
    const template = html`      
      <div class="page-content auth-page">      
        <div class="login-flex">
          <img class="login-graphic" src="/images/login-graphic.jpg" alt="Digital collage of flowers and book store photo on cardboard background">
          <div class="login-section">
            <div class="signinup-box">
                <h1>SIGN UP</h1>
                <form class="input-validation-required" @submit="${this.signUpSubmitHandler}">
                  <div class="input-group">
                    <sl-input class="login-input" label="First Name" name="firstName" type="text" placeholder="Enter first name" required></sl-input>
                  </div>
                  <div class="input-group">
                    <sl-input class="login-input" label="Last Name" name="lastName" type="text" placeholder="Enter last name" required></sl-input>
                  </div>
                  <div class="input-group">
                    <sl-input  class="login-input" label="Email" name="email" type="email" placeholder="Enter email" required></sl-input>
                  </div>
                  <div class="input-group">
                    <sl-input class="login-input" label="Password" name="password" type="password" placeholder="Enter password" required password-toggle></sl-input>
                  </div>   
                  <div class="input-group selector">
                    <sl-select class="access-selector" name="accessLevel" placeholder="I am a ...">
                      <sl-option class="option" value="1">Customer</sl-option>
                      <sl-option class="option" value="2">Admin</sl-option>
                    </sl-select>
                  </div>         
                  <sl-button variant="primary" type="submit" class="submit-btn login-btn" style="width: 100%;">Sign Up</sl-button>
                </form>
                <p>Have an account? <a href="/signin" @click=${anchorRoute}>Sign In</a></p>
              </div>
            </div> 
        </div>
      </div>
    `
    render(template, App.rootEl)
  }
}


export default new SignUpView()