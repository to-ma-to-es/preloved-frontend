import { LitElement, html, css } from 'lit'
import {anchorRoute, gotoRoute} from './../Router'
import Auth from './../Auth'
import App from './../App'

// to call this in code just write <va-app-header></va-app-header>
customElements.define('va-app-header', class AppHeader extends LitElement {
  constructor(){
    super()    
  }

  static get properties(){
    return {
      title: {
        type: String
      },
      user: {
        type: Object
      }
    }
  }

  firstUpdated(){
    super.firstUpdated()
    this.navActiveLinks()    
  }

  navActiveLinks(){ 
    const currentPath = window.location.pathname
    const navLinks = document.querySelectorAll('.app-top-nav a, .app-side-menu-items a')
    navLinks.forEach(navLink => {
      if(navLink.href.slice(-1) == '#') return
      if(navLink.pathname === currentPath){   
        navLink.classList.add('active')
      }
    })
  }

  hamburgerClick(){  
    const appMenu = document.querySelector('.app-side-menu')
    appMenu.show()
  }
  
  menuClick(e){
    e.preventDefault()
    const pathname = e.target.closest('a').pathname
    const appSideMenu = document.querySelector('.app-side-menu')
    // hide appMenu
    appSideMenu.hide()
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      gotoRoute(pathname)
    })
  }

  createRenderRoot(){
    return this
  }

  render(){    
    return html`
    <style>      
      * {
        box-sizing: border-box;
      }
      .preloved-logo {
        font-family: "League_Gothic";
        font-size: 2.3rem;
        text-decoration: none;
        margin-left: 1rem;
      }
      .app-header {
        /* background: var(--brand-color); */
        background: #FFFEF5;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--app-header-height);
        color: var(--brand-color);
        display: flex;
        z-index: 9;
        box-shadow: 4px 0px 10px rgba(0,0,0,0.2); 
        align-items: center;
        display: flex;
        justify-content: space-between; /* Pushes h1 and navigation to opposite sides of the screen */
        align-items: center;
      }
      i {
        margin: 0 .5em 0 .5em;
        font-size: .8rem;
      }


      .app-header-main {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

      .app-header-main::slotted(h1){
        color: #fff;
      }

      .app-logo a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2em;
        padding: .6em;
        display: inline-block;        
      }

      .app-logo img {
        width: 90px;
      }
      
      .hamburger-btn::part(base) {
        color: var(--brand-color);
      }

      .app-top-nav {
        display: flex;
        height: 100%;
        align-items: center;
      }

      .app-top-nav a {
        display: inline-block;
        padding: .8em;
        margin: 0 .8rem 0 .8rem;
        text-decoration: none;
        color: #5D5D5D;
      }
      
      .app-side-menu-items a {
        display: block;
        padding: .5em;
        text-decoration: none;
        font-size: 1.3em;
        color: #333;
      }

      .app-side-menu-logo {
        width: 120px;
        margin-bottom: 1em;
        position: absolute;
        top: 2em;
        left: 1.5em;
      }

      .page-title {
        color: var(--app-header-txt-color);
        margin-right: 0.5em;
        margin-bottom: 0em;
        font-size: var(--app-header-title-font-size);
      }

      /* active nav links */
      .app-top-nav a.active,
      .app-side-menu-items a.active {
        font-weight: 400;
      }

      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 768px){       
        
        .app-top-nav {
          display: none;
        }
        
      }
      @media all and (min-width: 768px){       
        .hamburger-btn {
          display: none;
        }
        
      }

    </style>

    <header class="app-header">
    <a href="/" class="preloved-logo" @click="${anchorRoute}">PRELOVED BOOKS</a>

    
      <nav class="app-top-nav">
        <a href="/aboutus" @click="${anchorRoute}">About Us</a>
        <a href="/profile" @click="${anchorRoute}">My Account <i class="fa-regular fa-user"></i></a>
        <a href="/favouritebooks" @click="${anchorRoute}">Wishlist <i class="fa-regular fa-star"></i></a> 
        <a href="/cart" @click="${anchorRoute}">Cart <i class="fa-solid fa-cart-shopping"></i></a>           
        
      </nav>
      <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 1.5em;"></sl-icon-button>
      
    </header>
    <sl-drawer class="app-side-menu" placement="start" class="drawer">
      <img class="app-side-menu-logo" src="/images/logo.svg">
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
        ${this.user.accessLevel == 2 ? html`
        <a href="/newBook" @click="${this.menuClick}">Add Book</a>
        ` : html``} 
        <a href="/books" @click="${this.menuClick}">Find a book</a>
        <a href="/hairdressers" @click="${this.menuClick}">Find hairdressers</a>
        <a href="/favouritebooks" @click="${this.menuClick}">Fav books</a>
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>
      </nav>  
    </sl-drawer>

    `
  }
  
})

/*    This conditional means only hairdressers see this option     ${this.user.accessLevel == 2 ? html`
<a href="/newBook" @click="${anchorRoute}">Add Book</a>
` : html``} 

Stuff i need for later
Shows page heading
    <div class="app-header-main">
        ${this.title ? html`
          <h1 class="page-title">${this.title}</h1>
        `:``}
        <slot></slot>
      </div>

if access lvl 2 show:
        ${this.user.accessLevel == 2 ? html`
        <a href="/newBook" @click="${anchorRoute}">Add Book</a>
        ` : html``} 
the profile route dropdowns
        <sl-dropdown>
          <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
            <sl-avatar style="--size: 24px;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar> ${this.user && this.user.firstName}
          </a>
          <sl-menu>            
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
            <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
          </sl-menu>
        </sl-dropdown>

        side menu spots
            <sl-drawer class="app-side-menu" placement="start" class="drawer">
      <img class="app-side-menu-logo" src="/images/logo.svg">
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
        ${this.user.accessLevel == 2 ? html`
        <a href="/newBook" @click="${this.menuClick}">Add Book</a>
        ` : html``} 
        <a href="/books" @click="${this.menuClick}">Find a book</a>
        <a href="/hairdressers" @click="${this.menuClick}">Find hairdressers</a>
        <a href="/favouritebooks" @click="${this.menuClick}">Fav books</a>
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>
      </nav>  
    </sl-drawer>
*/

