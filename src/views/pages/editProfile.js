import App from './../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import UserAPI from './../../UserAPI'
import Toast from '../../Toast'
import moment from 'moment'

class EditProfileView {
  init(){
    console.log('EditProfileView.init')
    document.title = 'Edit Profile'    
    this.user = null // page not visible until called upon
    this.render()    // page renders
    Utils.pageIntroAnim()
    this.getUser()    
  }

  /* Get UserAPI and all the details of the user */
  async getUser(){ 
    try {
      this.user = await UserAPI.getUser(Auth.currentUser._id)      
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  /* Submit new form details and update data */
  async updateProfileSubmitHandler(e){
    e.preventDefault()
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')
    try {
      const formData = new FormData(e.target)
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, formData)      
      delete updatedUser.password        
      this.user = updatedUser     
      Auth.currentUser = updatedUser
      this.render()
      Toast.show('profile updated')
    }catch(err){      
      Toast.show(err, 'error')
    }
    submitBtn.removeAttribute('loading')
  }

  render(){
    const template = html`
      <va-app-header title="Edit Profile" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      <div class="page-content edit-page">        
        ${(this.user == null) ? html`
          <sl-spinner></sl-spinner>
        `:html`
         <!-- <p>Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY, @ h:mm a')}</p> -->
          <form class="page-form input-validation-required" @submit=${this.updateProfileSubmitHandler.bind(this)}>
            <div class="edit-header">
              <h1>UPDATE ACCOUNT</h1>
              <sl-icon  @click=${()=> gotoRoute('/profile')} class="x-lg" name="x-lg"></sl-icon>
            </div>   
            <div class="edit-flex">
              <div class="edit-section-one">
                <div class="input-group">
                  <sl-input label="Change First Name" class="edit-profile-input" type="text" name="firstName" value="${this.user.firstName}" placeholder="First Name"></sl-input>
                </div>
                <div class="input-group">
                  <sl-input label="Change Last Name" class="edit-profile-input" type="text" name="lastName" value="${this.user.lastName}" placeholder="Last Name"></sl-input>
                </div>
                <div class="input-group">
                  <sl-input label="Change Email" class="edit-profile-input" type="text" name="email" value="${this.user.email}" placeholder="Email Address"></sl-input>
                </div>  
              </div>    
              <div class="edit-section-two"> 
                <div class="input-group">
                  <sl-textarea class="edit-profile-textarea" label="Change Description" name="bio" rows="4" placeholder="Add bio here" value="${this.user.bio}"></sl-textarea>
                </div>     
                <div class="input-group" class="avatar-change">
                  <label class="avatar-label">Change Avatar</label><br>          
                  ${(this.user.avatar) ? html`
                    <sl-avatar image="${App.apiBase}/images/${this.user.avatar}"></sl-avatar>
                    <input type="file" name="avatar" />
                  `: html`
                    <input type="file" name="avatar" />
                  `}
                </div>
              </div> 
            </div>
                <div class="button-wrapper">
                  <sl-button variant="primary" type="submit" class="submit-btn account-submit-btn" >Update Account</sl-button>
                </div>
          </form>
        `}
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new EditProfileView()