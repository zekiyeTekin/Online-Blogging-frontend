const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnNavbarLogin = document.querySelector('.btnLogin');
const iconClose = document.querySelector('.icon-close');



registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnNavbarLogin.addEventListener('click', ()=> {
    wrapper.classList.add('active-btnLogin');
});


iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-btnLogin');
});


function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeToken('token');
}



function register() {
const email = document.getElementById('email').value ; 
const password = document.getElementById('password').value ;   
const username = document.getElementById('username').value ;   



    fetch('http://localhost:8088/auth/register', {
      mode:'cors'  ,
      method: 'POST',
      headers: {

        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify({
            name: username,
            mail: email,
            password: password,
            
        })
      
    })
    .then(response =>{
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
        })
    .then(data => {
        console.log('Success:', data);
        if (data.token) {
            console.log('Token:', data.token);
        } else {
            console.log('No token received');
        }
     
    })
    .catch ((error) => {
        console.error('Connection not registered:', error);
    }
    )};

    document.getElementById('register-btn').addEventListener('click', ()=> {
        register();
    });







   
 function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        console.log(email, password);


         fetch('http://localhost:8088/auth/login', {
            mode:'cors'  ,
            method: 'POST',
            headers: {
      
              'Content-Type': 'application/json'
            },
            body: 
              JSON.stringify({
                  mail: email,
                  password: password
              })
            
          })
          .then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();

          })
          .then(data => {
            console.log('Success:', data);
            if (data.token) {
                console.log('Token:', data.token);
                
                localStorage.setItem('authToken', data.token);
                saveToken(data.token);

                window.location.href = "index.html";
            } else {
                console.log('No token received');
            }
           
          })
          .catch ((error) => {
            console.error('There was a problem with the fetch operation:', error);
          }
        );
}
    
    document.getElementById('login-btn').addEventListener('click', ()=> {
        login();
    });



    
    