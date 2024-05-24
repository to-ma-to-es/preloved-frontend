import App from '../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import UserAPI from './../../UserAPI'

class GuideView {
  init(){
    document.title = 'Guide'    
    this.render()    
    Utils.pageIntroAnim()
    this.updateCurrentUser()
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

  render(){
    const template = html`
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">  <!-- calign class in base.scss-->      
        <h3 class="brand-color">Welcome ${Auth.currentUser.firstName}!</h3>
        <p>This is a quick tour to teach you the basics of using Books ...</p>

        <div class="guide-step">
          <h4>Search Hairdressers</h4>
          <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
        </div>

        <div class="guide-step">
          <h4>Find a book</h4>
          <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
        </div>

        <div class="guide-step">
          <h4>Save books to favourites</h4>
          <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
        </div>

<sl-button variant="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new GuideView()