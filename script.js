// CONFIGURATION BLOCK
const POOL_DATA = {
    UserPoolId: 'us-east-1_3JaMqEDLz', 
    ClientId: '1o43fgk6gtk0ca5944f0qlhsit'
};
const API_URL = "https://acnd5wpigj.execute-api.us-east-1.amazonaws.com";

const userPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);

// Check current validation state on load
document.addEventListener("DOMContentLoaded", () => {
    const activeUser = localStorage.getItem("userEmail");
    const greeting = document.getElementById("userGreeting");
    const navBtn = document.getElementById("loginNavBtn");
    
    if (activeUser && greeting) {
        greeting.innerText = `Hi, ${activeUser.split('@')[0]}!`;
        navBtn.innerText = "Log Out";
        navBtn.href = "#";
        navBtn.onclick = () => {
            localStorage.clear();
            alert("Logged out successfully");
            window.location.reload();
        };
    }
});

// AWS COGNITO SIGN UP FUNCTION
function signUpUser() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    const attributeList = [];
    
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) { alert(err.message || JSON.stringify(err)); return; }
        alert("Registration complete! Please check your email inbox for validation code.");
        document.getElementById("verificationArea").style.display = "block";
    });
}

// AWS COGNITO EMAIL VERIFICATION CONFIRMATION
function verifyUserEmail() {
    const email = document.getElementById('regEmail').value;
    const code = document.getElementById('verCode').value;
    
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) { alert(err.message); return; }
        alert("Email confirmed successfully! You can now log in.");
        window.location.reload();
    });
}

// AWS COGNITO SIGN IN FUNCTION
function signInUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            localStorage.setItem("userEmail", email);
            alert("Login verified across cloud!");
            window.location.href = "index.html";
        },
        onFailure: (err) => { alert(err.message || JSON.stringify(err)); }
    });
}

// DYNAMIC SHIFT VIEW PRODUCTS FETCH
// DYNAMIC IMAGE MATCHER
function getProductImage(productName) {
  const name = productName.toLowerCase();
  if (name.includes("jacket") || name.includes("windbreaker")) return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80";
  if (name.includes("shorts")) return "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80";
  if (name.includes("dress")) return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80";
  if (name.includes("sweater") || name.includes("knit")) return "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80";
  if (name.includes("shirt")) return "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80";
  if (name.includes("sunglasses")) return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80";
  return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80"; // Default Store Image
}

// DYNAMIC PRODUCT CATALOG LOAD
async function fetchProducts(season) {
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = "<p class='loader-msg'>✨ Querying AWS catalog...</p>";
  
  try {
    const url = season === 'All' ? `${API_URL}/products` : `${API_URL}/products?season=${season}`;
    const response = await fetch(url);
    const products = await response.json();
    grid.innerHTML = ""; 
    
    products.forEach(product => {
      // Get the matching image based on the product name
      const imgUrl = getProductImage(product.name);
      
      grid.innerHTML += `
        <div class="card">
          <div class="product-img-wrapper">
            <img class="product-img" src="${imgUrl}" alt="${product.name}">
          </div>
          <div class="card-details">
            <h3>${product.name}</h3>
            <div class="card-bottom">
              <span class="price">₹${product.price}</span>
              <button style="background:#ff69b4; border:none; color:white; padding:8px 15px; border-radius:20px; font-weight:bold; cursor:pointer;" 
                onclick="addToCloudCart('${product.productId}', '${product.name}', ${product.price})">🛒 Add</button>
            </div>
          </div>
        </div>`;
    });
  } catch (error) { 
    grid.innerHTML = "<p class='loader-msg'>Error communicating with backend.</p>"; 
  }
}

// CART ADD LINK ROUTER
async function addToCloudCart(pid, name, price) {
    const email = localStorage.getItem("userEmail");
    if(!email) { alert("Please log in first to manage your shopping cart!"); return; }
    
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, productId: pid, name: name, price: price })
        });
        const res = await response.json();
        alert(res.message);
    } catch (e) { alert("Cart network routing error."); }
}

// CART VIEW POPULATOR
async function loadCartItems(email) {
    const listEl = document.getElementById("cartItemsList");
    const totalEl = document.getElementById("cartTotal");
    
    try {
        const response = await fetch(`${API_URL}/cart?email=${email}`);
        const items = await response.json();
        listEl.innerHTML = "";
        let total = 0;
        
        if(items.length === 0) { listEl.innerHTML = "<p>Your cart is empty.</p>"; return; }
        
        items.forEach(item => {
            total += item.price;
            listEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
                    <span>${item.productName}</span>
                    <span style="font-weight:bold;">₹${item.price}</span>
                </div>`;
        });
        totalEl.innerText = `₹${total}`;
    } catch(e) { listEl.innerHTML = "<p>Error loading cart list.</p>"; }
}

if(document.getElementById('productGrid')) fetchProducts('All');