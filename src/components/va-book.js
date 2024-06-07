import { LitElement, html, render } from 'lit' // bring in lit library
import {anchorRoute, gotoRoute} from '../Router' // when navigating u need router
import Auth from '../Auth' // access info from user
import App from '../App' // access info from app
import UserAPI from '../UserAPI'
import Toast from '../Toast'

customElements.define('va-book', class Book extends LitElement {
  constructor(){
    super()    
  }

  static get properties(){
    return {
      id: {
        type: String
      },
      name: {
        type: String // this means that i can write <va-book name=" what user wants to set title to be here"></va-book>
      },
      author: {
        type: String 
      },
      description: {
        type: String
      },
      price: {
        type: String
      }, 
      user: {
        type: Object
      },
      image: {
        type: String
      },
      condition: {
        type: String
      }, 
      coverType: {
        type: String
      }, 
      year: {
        type: String
      },
      genre: {
        type: String
      }
    }
  }

  firstUpdated(){
    super.firstUpdated()
  }

  async moreInfoHandler(){
    // create sl-dialog
    const dialogEl = document.createElement('div')
    // give class name
    dialogEl.className = 'book-dialog'
    // sl-dialog content
   const dialogContent = html`
    <style>
      /* for desktop screens ------------------------------ */
      @media all and (min-width: 768px){
        
        .wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
        }
        .listing-wrap {
            display: flex;
            align-self: center;
            align-items: center;
            justify-content: center;
            max-width: 80%;
          }
  
        .image {
          max-width: 30%;
        }

        .content {
          margin-left: 2rem;
        }
        #description {
          max-width: 90ch;
        }

        .info-cart-section {
          display: flex;
          align-items: center;
        }

        #backButton {
          margin-left: 10vw;
        }
      }

      /* Heading */
      h1 {
        font-family: var(--league);
        text-transform: uppercase;
        font-size: 2.5rem;
      }

      /* author-wishlist content */
      .author-wishlist-section {
        display: flex;
        align-items: center;
      }
      /* Wishlist */
      #wishlist {
        margin-left: 2rem;
      }

      /* Wishlist icon button */
      .fav-star {
      padding: 0 0 0.1rem 0.2rem;
      color: var(--brand-color);
      }

      /* Description */
      #description {
        line-height: 1.4;
      }

      /* Genre section */
      .genre-section {
        display: flex;
      }

      .genre {
        border-bottom: var(--brand-color) solid 2px;
        max-width: 5rem;
        text-align: center;
        margin-left: 1rem;
      }

      /* info-cart section */
      .info-cart-section p {
        margin-right: 3rem;
        line-height: 2;
        text-align: center;
      }

      .price {
        background-color: #ebefd8;
        padding: 0 1rem 0 1rem;
      }

      /* Image */
      .image img {
          width: 100%;
      }

      /* Written content */
      .content {
          padding-left: 1em;
      }

      /* General styles */
      .condition span,
      .cover-type span, 
      .year span, .price span, .genre {
          text-transform: capitalize;
      }

      .condition span,
      .cover-type span, 
      .year span, .price span, .genre-heading, #wishlist {
          color: #7f7f7f;
      }

      /* Back btn */
      #backButton {
        border: none;
        max-width: 6rem;
        font-family: var(--bold);
        font-size: 1.4rem;
        background-color: transparent;
        padding: .5rem; /* more click space */
        margin-bottom: 2rem;
      }

      #backButton i {
        font-size: 1.2rem;
      }

      /* Animation */
      @keyframes fadeInDown {
        0% {
          transform: translateY(-2%);
          opacity: 0;
        }
        100% {
          transform: translateY(0%);
          opacity: 1;
        }
      }

      .fadeInDown-animation {
        animation: .5s fadeInDown;
      }
      
      /* Responsive resize for mobile */
      @media all and (max-width: 768px) {
        #description {
          padding: 0 0.5rem;
        }
      }
    </style>
      
      <div class="wrap">
      <button id="backButton"><i class="fa-solid fa-caret-left"></i>Back</button>

        <div class="listing-wrap fadeInDown-animation">
          
          <div class="image">
              <img src="${App.apiBase}/images/${this.image}" />
          </div>
          <div class="content">
              <h1>${this.name}</h1>
              <div class="author-wishlist-section">
                <p>${this.author}</p>
                <p id="wishlist">Wishlist</p>
                <sl-icon-button class="fav-star" name="star" label="Add to favourites" @click=${this.addFavHandler.bind(this)}></sl-icon-button>
              </div>
              <p id="description">${this.description}</p>
              <div class="genre-section">
                <p class="genre-heading">Genres</p>
                <p class="genre">${this.genre}</p>
              </div>
              
              <div class="info-cart-section">
                <p class="condition">Condition <br><span>${this.condition}</span></p>
                <p class="cover-type">Cover <br><span>${this.coverType}</span></p>
                <p class="year">Year <br><span>${this.year}</span></p>
                <p class="price">Price <br><span>$${this.price}</span></p>
                
                
                <sl-button class="cart-btn" @click=${this.addCaHandler.bind(this)}>
                <sl-icon slot="suffix" name="cart"></sl-icon>
                ADD TO CART
                </sl-button>
              </div>
          </div>
        </div>
      </div>
`
    
    render(dialogContent, dialogEl)
    // append to document.body
    await document.body.append(dialogEl)

    const backButton = document.querySelector('#backButton')
    const header = document.querySelector('.app-header')

    // remove div when back btn is pressed
    backButton.addEventListener('click', () => {
      dialogEl.remove();
    })

    // also remove div when a header btn / a tag is pressed 
    header.addEventListener('click', () => {
      dialogEl.remove();
    })

    /* // show sl-dialog
    dialogEl.show()

    // on hide, delete
    dialogEl.addEventListener('sl-after-hide', () => {
        dialogEl.remove()
    }) */ 
  }

  async addFavHandler(){    
    try {
      await UserAPI.addFavBook(this.id)
      Toast.show(' Book added to favourites')
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  async addCaHandler(){    
    try {
      await UserAPI.addCaBook(this.id)
      Toast.show('Book added to cart')
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  
  render(){    
    return html`
    <style>
      /* Card Styling */
      sl-card::part(base) {
        border: none !important;
        background-color: var(--body-bg);
        box-shadow: none;
      }

      sl-card::part(body){
        padding: 0;
     }

     .price-section {
      display: flex;
      justify-content: space-between; 
      align-items: center;
     }

     .fav-star {
      padding-bottom: .5rem;
      color: var(--brand-color);
     }

     h2 {
      font-size: 1.2rem;
     }

     p{
      margin: 0;
      padding:0;
     }

     .price-section, p {
      color: #3f3f3f;
     }
     
    /* Enlarge animation */
    sl-card { 
      cursor: pointer;
      transition: transform 0.15s ease-in-out;
    }

    sl-card:hover {
      transform: scale(1.03);
    }

    </style>

    <sl-card class="listing">
        <img slot="image" src="${App.apiBase}/images/${this.image}" @click=${this.moreInfoHandler.bind(this)}>
        <h2 @click=${this.moreInfoHandler.bind(this)}>${this.name}</h2>
        <p @click=${this.moreInfoHandler.bind(this)}>${this.author}</p>
        <div class="price-section">
          <h3>$${this.price}</h3>
          <sl-icon-button class="fav-star" name="star" label="Add to favourites" @click=${this.addFavHandler.bind(this)}></sl-icon-button>
        </div>
        
    </sl-card>    
    `
  }
  
})

/*  <sl-button @click=${this.moreInfoHandler.bind(this)}>More Info</sl-button> the .bind(this) ensures javascript understands 
"this" as class Book instead of thinking "this" refers to sl-button bc fnc*


more info fnc - instead of sl dialog create a div, or edit dialog to look like a view 

<p class="author">by ${this.user.firstName} ${this.user.lastName}</p>
<sl-button @click=${this.moreInfoHandler.bind(this)}>More Info</sl-button>
<sl-icon-button name="cart" label="Add to cart" @click=${this.addCaHandler.bind(this)}></sl-icon-button>
*/