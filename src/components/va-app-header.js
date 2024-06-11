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

  // control navigation links
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

  // responsive menu 
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
        background: var(--body-bg);
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--app-header-height);
        color: var(--brand-color);
        display: flex;
        z-index: 11;
        justify-content: space-between; /* Pushes h1 and navigation to opposite sides of the screen */
        align-items: center;
      }

      i {
        margin: 0 .5em 0 .5em;
        font-size: .8rem;
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

      /* Make Active Nav btns bold */
      .active,
      .app-top-nav a:hover {
        font-family: var(--bold);
      } 
      
      /* Apply underline hover animation */
      .app-top-nav a {
      position: relative;
      text-decoration: none;
      }
      
      .app-top-nav a::before {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #000;
        transform: scaleX(0);
        transition: transform 0.6s ease;
      }

      .app-top-nav a:hover::before {
        transform: scaleX(1);
      }
      
    </style>

    <header class="app-header">
      <a href="/" class="preloved-logo" @click="${anchorRoute}">PRELOVED BOOKS</a>
        <nav class="app-top-nav">
            <a href="/"  @click="${anchorRoute}">Books <i class="fa-solid fa-book"></i></a>
            <a href="/profile" @click="${anchorRoute}">My Account <i class="fa-regular fa-user"></i></a>
            <a href="/favouritebooks" @click="${anchorRoute}">Wishlist <i class="fa-regular fa-star"></i></a> 
            <a href="/cart" @click="${anchorRoute}">Cart <i class="fa-solid fa-cart-shopping"></i></a>           
        </nav>
        <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 1.5em;"></sl-icon-button>
    </header>
    <sl-drawer class="app-side-menu" placement="start" class="drawer">
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Books</a>
        <a href="/profile" @click="${this.menuClick}">Account</a>
        <a href="/favouritebooks" @click="${this.menuClick}">Wishlist</a>
        <a href="/cart" @click="${this.menuClick}">Cart</a>
        ${this.user.accessLevel == 2 ? html`
        <a class="admin-option" href="/newBook" @click="${this.menuClick}">Add Book</a>
        ` : html``} 
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>
      </nav>  
    </sl-drawer>
    `
  }
})

/* This conditional means only hairdressers see this option ${this.user.accessLevel == 2 ? html`
<a href="/newBook" @click="${anchorRoute}">Add Book</a>
` : html``} */


