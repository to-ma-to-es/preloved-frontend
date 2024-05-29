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
        type: String // this means that i can write <va-book title=" what user wants to set title to be here"></va-book>
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
        .wrap {
            display: flex;
        }
        .image {
            width: 50%;
        }
        .image img {
            width: 100%;
        }
        .content {
            padding-left: 1em;
        }
        .condition span,
        .cover-type span, 
        .year span {
            text-transform: capitalize;
            color: #3f3f3f;
        }
        .price {
            font-size: 1.5em;
        }
    </style>
        <div class="wrap">
        <button id="backButton">back</button>
        <div class="image">
            <img src="${App.apiBase}/images/${this.image}" />
        </div>
        <div class="content">
            <h1>${this.name}</h1>
            <h2>${this.author}</h2>
            <p>${this.description}</p>
            <p class="price">$${this.price}</p>
            <p class="condition">Condition: <span>${this.condition}</span></p>
            <p class="cover-type">Cover Type: <span>${this.coverType}</span></p>
            <p class="year">Year: <span>${this.year}</span></p>

            <sl-button @click=${this.addFavHandler.bind(this)}>
            <sl-icon slot="prefix" name="heart-fill"></sl-icon>
            Add to Favourites
            </sl-button>
            <sl-button @click=${this.addCaHandler.bind(this)}>
            <sl-icon slot="prefix" name="cart"></sl-icon>
            Add to Cart
            </sl-button>
        </div>
        </div>
`
    
    render(dialogContent, dialogEl)
    // append to document.body
    await document.body.append(dialogEl)

    const backButton = document.querySelector('#backButton')

    backButton.addEventListener('click', () => {
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
      sl-card::part(base) {
        border: none;
        background-color: var(--body-bg);
        box-shadow: none;
     }

     sl-card::part(body){
      font-size: .9rem;
      padding: 0;
     }

     .price-section {
      display: flex;
      justify-content: space-between; 
      align-items: center;
      color: #3f3f3f;
      
     }
     .fav-star {
      padding-bottom: .5rem;
      color: var(--brand-color);
     }

     p{
      color: #3f3f3f;
      margin: 0;
      padding:0;
     }
    </style>

    <sl-card>
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