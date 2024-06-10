import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import UserAPI from './../../UserAPI'
import { gsap } from "gsap";

class GuideView {
  init(){
    document.title = 'Guide'    
    this.render()    
    Utils.pageIntroAnim()
    this.updateCurrentUser()
    this.animateGuideStep()
  }

  async updateCurrentUser(){
    try{
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, { newUser: false}, 'json')
      console.log('user updated')
      console.log(updatedUser)
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  animateGuideStep() {
    gsap.from(".guide-step", {
      delay: 0.5,
      opacity: 0,
      y: 50,
      stagger: 0.6,
      duration: 3,
      ease: "power3.out"
    });
  }
  
  render(){
    const template = html`
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign guide-page">      
        <h3 class="banner">Welcome ${Auth.currentUser.firstName}!</h3>
        <p>THIS IS A QUICK TOUR TO TEACH YOU THE BASICS OF USING PRELOVED BOOKS</p>

        <div class="guide-step">
          <h4>Browse through second hand books</h4>
          <img src="/images/browse-books.jpg" alt="Picture of a second hand bookstore">
          <sl-icon class="guide-icon" name="book"></sl-icon>
          <sl-icon class="guide-icon" name="heart"></sl-icon>
        </div>

        <div class="guide-step">
          <h4>Find an interesting book!</h4>
          <img src="/images/find-book.jpg" alt="Picture of a woman holding a book">
          <sl-icon class="guide-icon" name="person-heart"></sl-icon>
          <sl-icon class="guide-icon" name="emoji-laughing"></sl-icon>
        </div>

        <div class="guide-step">
          <h4>Save to your wishlist, or add to cart!</h4>
          <img src="/images/register.jpg" alt="Picture of a cash register at a bookstore">
          <sl-icon class="guide-icon" name="star"></sl-icon>
          <sl-icon class="guide-icon" name="cart3"></sl-icon>
        </div>

        <sl-button variant="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new GuideView()