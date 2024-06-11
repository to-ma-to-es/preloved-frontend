import App from './../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import moment from 'moment'

class ProfileView {
  init(){
    console.log('ProfileView.init')
    document.title = 'My Account'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const user = Auth.currentUser;
    const template = html`
      <va-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content account-page">   
        <div class="profile-photo">       
           ${Auth.currentUser && Auth.currentUser.avatar ? html`
            <sl-avatar style="--size: 14rem;" image=${(Auth.currentUser && Auth.currentUser.avatar) ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}></sl-avatar>
          `:html`
          <sl-avatar style="--size: 14rem;"></sl-avatar>
          `}
        </div>    
        <div class="profile-info">
          <h1>MY ACCOUNT</h1>
          <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
          <p>${Auth.currentUser.email}</p>
          <p>Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY')}</p>
          <!--  if there is bio, display bio, if not, display nothing --> 
          ${Auth.currentUser.bio ? html`
          <p>${Auth.currentUser.bio}</p>
          ` : html``
          }
          <div class="account-btns">
            ${user.accessLevel === 2 ? html`
            <sl-button class="account-btn" @click=${()=> gotoRoute('/newBook')}>Add book listings</sl-button>
            ` : html``}
            ${user.accessLevel === 2 ? html`
            <sl-button class="account-btn">Delete book listings</sl-button>
            ` : html``}
            ${user.accessLevel === 2 ? html`
            <sl-button class="account-btn">Edit book listings</sl-button>
            ` : html``}
            <sl-button class="account-btn" @click=${()=> gotoRoute('/editProfile')}>Edit Account</sl-button>
          </div>
          <sl-button class="sign-out-btn" @click="${() => Auth.signOut()}">SIGN OUT</sl-button>
        </div> 
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new ProfileView()