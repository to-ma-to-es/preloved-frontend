import App from './../../App'
import {html, render } from 'lit'
import {anchorRoute, gotoRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class SignInView {
  init(){
    console.log('SignInView.init')
    document.title = 'Sign In'
    this.render()
    Utils.pageIntroAnim()
  }

  signInSubmitHandler(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    
    // sign in using Auth    
    Auth.signIn(formData, () => {
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
              <h1>PRELOVED BOOKS</h1>   
              <p>To browse and purchase a range of second hand books online, please log in</p>     
              <form class="input-validation-required" @submit="${this.signInSubmitHandler}">          
                <div class="input-group">
                  <sl-input class="login-input" label="Email" name="email" type="email" placeholder="Enter email" required></sl-input>
                </div>
                <div class="input-group">
                  <sl-input class="login-input" label="Password" name="password" type="password" placeholder="Enter Password" required password-toggle></sl-input>
                </div>
                <p>Forgot Password?</p>
                <sl-button type="submit" variant="primary" class="submit-btn login-btn">Log In</sl-button>
                
              </form>
              <p>Not a member yet? <a href="/signup" @click=${anchorRoute}>Sign Up</a></p>
              <div class="icons">
                <img class="signin-icons" src="/images/google.png" alt="google sign up icon">
                <img class="signin-icons" src="/images/facebook.png" alt="facebook sign up icon">
                <img class="signin-icons" src="/images/microsoft.png" alt="microsoft sign up icon">
              </div>
            </div>
          </div>

        </div>
      </div>
    `
    render(template, App.rootEl)    
  }
}

export default new SignInView()