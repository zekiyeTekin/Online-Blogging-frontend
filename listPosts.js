 //localStorage.setItem("authToken", "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ6ZWtAZ21haWwuY29tIiwiaWF0IjoxNzI2NTIxNTI2LCJleHAiOjE3MjY1MzAxNjYsImF1dGhvcml0aWVzIjpbIlVTRVIiXX0.2GUOdnJUxP3sdo3MhJi7MSl6nWjCaRe3qqL3yIgPvhUiQ4BE2jrj1ngFopfKee-Y");


 //ÇIKIŞ YAPMA FONKSİYONU START
 document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logoutLink');

    // Eğer logoutLink mevcutsa dinleyici ekle
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    } else {
        console.warn("logoutLink bulunamadı.");
    }

    // Token kontrol fonksiyonu
    function getToken() {
        return localStorage.getItem('token');
    }
  
    // Token silme fonksiyonu
    function removeToken() {
        localStorage.removeItem('token');
    }
  
    // Login sayfasına yönlendirme fonksiyonu
    function redirectToLogin() {
        window.location.href = 'login.html';
    }
  
    // Çıkış fonksiyonu
    function logout() {
        removeToken();
        redirectToLogin();
    }

    // Eğer token yoksa login sayfasına yönlendir
    if (window.location.pathname !== '/login.html' && !getToken()) {
        redirectToLogin();
    }
  
    // Sayfa geri gidildiğinde login sayfasına yönlendir
    window.addEventListener('popstate', () => {
        if (!getToken()) {
            redirectToLogin();
        }
    });
});


//ÇIKIŞ YAPMA FONKSİYONU END



 //POSTLARI LİSTELEME FONKSİYONU START
const postList = document.getElementById("postList");

window.onload = function() {
    //const postList = document.getElementById("postList");
    fetchPosts();  
}


//KULLANICI ADINI BULMAK İÇİN START
function fetchUserNames(emails) {
    const token = getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    return fetch(`http://localhost:8088/user/usernames?emails=${emails.join(',')}`, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching user names:', error);
        return {}; 
    });
}





//KULLANICI ADINI BULMAK İÇİN END!!! BURADA POSTEDBY KISMINDA KULLANICI MAİLİNİ ALIYORUM

// function fetchPosts() {
//     //const token = localStorage.getItem("authToken");
//     const token = getToken();
//     const headers = new Headers();

//     headers.append('Authorization', `Bearer ${token}`);
//     headers.append('Content-Type', 'application/json');


//     fetch('http://localhost:8088/post/get/posts', {
//         mode: 'cors',
//         method: 'GET',
//         headers: headers
//     })
//     .then(response => response.json())
//     .then(posts => {
//         const postList = document.getElementById("postList");
        
//         //console.log(posts.data);
//         if (!postList) {
//             console.error('postList element not found');
//             return;
//         }

//         //console.log("tüm postları görüntülüyoruz",posts); 
//         if (!posts.data || !Array.isArray(posts.data)) {
//             console.error('Invalid posts data format');
//             return;
//         }

//         let htmlContent = '';
//         posts.data.forEach(post => {
//             const imgUrl = `http://localhost:8088/upload/images/${post.img}`;
//             // console.log('Image URL:', imgUrl); 
//             //console.log("postedBy",post.postedBy);
            
//             htmlContent += `
//                 <div class="post">
//                     <h3>${post.name}</h3>
//                     <p>Posted by: ${post.postedBy }</p>
//                     <p>Date: ${new Date(post.date).toLocaleString()}</p>
//                     <div class="post-content">
//                          <img src="${imgUrl}"  alt="${post.title}>
//                         <p>${post.content}</p>
//                     </div>
//                     <div class="post-footer">
//                         <div class="button-container">
//                             <button onclick="likePost(${post.id}, this)"><i class="fas fa-thumbs-up"></i>(${post.likeCount})</button>
//                             <button><i class="fas fa-eye"></i>(${post.viewCount})</button>
//                             <button onclick="openPostPopup(${post.id})"> View Post</button>  <!-- View Post Butonuna onclick event ekliyoruz -->
//                         </div>
//                     </div>
//                 </div>
//             `;
//         });

//         postList.innerHTML = htmlContent;
//     })
//     .catch(error => {
//         console.error('Error fetching posts:', error);
//     });
// }

 //POSTLARI LİSTELEME FONKSİYONU END !!! BURADA POSTEDBY KISMINDA KULLANICI MAİLİNİ ALIYORUM


 function fetchPosts() {
    const token = getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    fetch('http://localhost:8088/post/get/posts', {
        mode: 'cors',
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(posts => {
        const postList = document.getElementById("postList");
        if (!postList) {
            console.error('postList element not found');
            return;
        }

        if (!posts.data || !Array.isArray(posts.data)) {
            console.error('Invalid posts data format');
            return;
        }

        
        const emailList = [...new Set(posts.data.map(post => post.postedBy))];

        fetchUserNames(emailList)
            .then(emailToNameMap => {
                
                let htmlContent = '';
                posts.data.forEach(post => {
                    //console.log("postedBy",post.postedBy);
                    //console.log("postedBy",emailList);
                    const imgUrl = `http://localhost:8088/upload/images/${post.img}`;
                    const postedByName = emailToNameMap[post.postedBy] || post.postedBy;

                    htmlContent += `
                        <div class="post">
                            <p style="text-align: left;"><i class="fas fa-user"></i> : ${postedByName}</p>
                            <p style="text-align: left;"><i class="fas fa-calendar-alt"></i> : ${new Date(post.date).toLocaleString()}</p>
                            <h3>${post.name}</h3>
                            <div class="post-content">
                                 <img src="${imgUrl}" alt="${post.title}">
                                <p>${post.content}</p>
                            </div>
                            <div class="post-footer">
                                <div class="button-container">
                                    <button onclick="likePost(${post.id}, this)"><i class="fas fa-heart"></i>(${post.likeCount})</button>
                                    <button><i class="fas fa-eye"> </i>(${post.viewCount})</button>
                                    <button onclick="openPostPopup(${post.id})"> View Post</button>
                                </div>
                            </div>
                        </div>
                    `;
                });

                postList.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error('Error processing user names:', error);
            });
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}






//kULLANICININ MAİLİ İLE ID BULMA START
// function getAuthenticatedUserId() {
//     const token = getToken();
//     const headers = new Headers();

//     headers.append('Authorization', `Bearer ${token}`);
//     headers.append('Content-Type', 'application/json');

//     const decodedToken = parseJwt(token);
//     const userEmail = decodedToken.sub;

//     if (!token) {
//         console.error("No authentication token found.");
//         return null;
//     }

//     console.log("userEmaiedcfeerl",userEmail);

//     // Kullanıcı mailine göre ID'yi almak için API çağrısı yap
//     fetch(`http://localhost:8088/user/by?mail=${userEmail}`, {
//         method: 'GET',
//         headers: headers
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok: ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(user => {
//         console.log("User ID:", user.id); // Kullanıcı ID'sini burada kullanabilirsiniz
//         return user.id; // Gerekirse burada dönebilirsiniz
//     })
//     .catch(error => {
//         console.error('Error fetching user ID:', error);
//     });
// }



function getUserByEmail(email) {
    const token = getToken(); 
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

   
    return fetch(`http://localhost:8088/user/by?mail=${email}`, {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorResponse => {
                console.error('Error fetching user by email:', errorResponse.message);
                throw new Error('Kullanıcı bilgileri alınamadı.');
            });
        }
        return response.json(); 
    })
    .then(userData => {
       // console.log("userdata",userData.id);
        return userData.id; 
    })
    .catch(error => {
        console.error('Error in getUserByEmail:', error);
        return null; 
    });
}


 //POSTLARI BEĞENME/BEĞENMEME FONKSİYONU START
function likePost(postId, buttonElement) {
    const token = getToken();
    const headers = new Headers();
    
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    
    const decodedToken = parseJwt(token);
    //console.log('Email from token:', decodedToken);
    const postedBy = decodedToken.sub; 
    //console.log('Name from token:', postedBy);  

    getUserByEmail(postedBy)
        .then(user => {
            if (!user) {
                throw new Error('User ID could not be retrieved.');
            }
            const userId = user; 
            //console.log('User ID from email:', userId);

           
            return fetch(`http://localhost:8088/like/by?userId=${userId}&postId=${postId}`, {
                method: 'POST',
                headers: headers,
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json();
            }
            return response.json();
        })
        .then(updatedPost => {
            //console.log("updatedPost",updatedPost.data);

            if (updatedPost && updatedPost.data) {
                const likeButton = buttonElement;
                const updatedLikeCount = updatedPost.data.post.likeCount;
                
                likeButton.innerHTML = `<i class="fas fa-heart"></i> (${updatedLikeCount})`;
                //console.log(updatedLikeCount);
                const popup = document.getElementById('popup');
                if (popup && popup.querySelector('.button-container button')) {
                    const popupLikeButton = popup.querySelector('.button-container button');
                    popupLikeButton.innerHTML = `<i class="fas fa-heart"></i> (${updatedLikeCount})`;
                }
            } else {
                alert('Beğeni veya beğenme işleminden vazgeçme sırasında bir hata oluştu.');
            }
        })
        .catch(error => {
            console.error('Error liking post:', error);
        });
}
 //POSTLARI BEĞENME/BEĞENMEME FONKSİYONU END



 function getToken() {
    return localStorage.getItem('token');
  }




// POST DETAYINI GÖRÜNTÜLEME FONKSİYONU START
function openPostPopup(postId) {
    const token = getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    fetch(`http://localhost:8088/post/by?id=${postId}`, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(post => {
       
        return fetchUserNames([post.data.postedBy])  
            .then(emailToNameMap => {
                const postedByName = emailToNameMap[post.data.postedBy] || post.data.postedBy;
                
                const tagsHtml = Array.isArray(post.data.tags) ? post.data.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
                const imgUrl = `http://localhost:8088/upload/images/${post.data.img}`;
                
                
                const popupContent = `
                    <div id="popup" class="popup">
                        <div class="popup-content">
                            <span class="close-btn" onclick="closePopup()">&#x2716;</span>
                            <div class="popup-body">
                                <div class="popup-details">
                                <p style="text-align: left;"><i class="fas fa-user"></i> : ${postedByName}</p>
                                    <p style="text-align: left;"><i class="fas fa-calendar-alt"></i> : ${new Date(post.data.date).toLocaleString()}</p>
                                    <h3>${post.data.name}</h3>
                                    <div class="post-content">
                                        <img src="${imgUrl}" alt="${post.data.title}" class="popup-img">
                                        <p>${post.data.content}</p>
                                    </div>
                                    <div class="post-tags" id="post-tags">${tagsHtml}</div>
                                    <!-- Yorum Ekleme Alanı -->
                                    <div class="comment-section">
                                        <textarea id="comment-content" placeholder="Yorumunuzu yazın..."></textarea>
                                        <button onclick="submitComment(${post.data.id})"><i class="fas fa-comment"></i> Publish</button>
                                    </div>
                                </div>
                                <div class="popup-comments">
                                    <div id="comments-section" class="comments-section">
                                        <!-- Yorumlar buraya eklenecek -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', popupContent);

               
                loadComments(postId);

               
                document.getElementById('popup').style.display = 'flex';
            });
    })
    .catch(error => {
        console.error('Error fetching post details:', error);
    });
}
// POST DETAYINI GÖRÜNTÜLEME FONKSİYONU END



//YORUMLARI GÖRÜNTÜLEME FONKSİYONU START
function loadComments(postId) {
    //const token = localStorage.getItem("authToken");
    const token = getToken();
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    fetch(`http://localhost:8088/comment/by?postId=${postId}`, {
        method: 'GET',
        headers: headers,
    })
    .then(response => response.json())
    .then(comments => {
        const commentsSection = document.getElementById('comments-section');
        //console.log(comments);
        commentsSection.innerHTML = Array.isArray(comments.data) ? comments.data.map(comment => `
            <div class="comment">
                <p><strong>${comment.postedBy}</strong> - ${new Date(comment.createdAt).toLocaleString()}</p>
                <p>${decodeURIComponent(comment.content)}</p>
            </div>
        `).join('') : '';
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
    });
}
//YORUMLARI GÖRÜNTÜLEME FONKSİYONU END



function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
}

//YORUM YAPMA FONKSİYONU START
function submitComment(postId) {
    //const token = localStorage.getItem("authToken");
    const token = getToken();
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const decodedToken = parseJwt(token);
    const name = decodedToken.name; 
    //console.log('Name from token:', name);
    //console.log('Email from token:', decodedToken);
    //const postedBy = decodedToken.sub; //postedby da email kullanmak istersem diye

    const commentContent = document.getElementById('comment-content').value;
    

    const bodyData = {
        content : commentContent,
        postedBy : name
    };

    fetch(`http://localhost:8088/comment/create?postId=${postId}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        loadComments(postId);
        document.getElementById('comment-content').value = ''; 
        //alert('Yorum başarılı bir şekilde eklendi.');
    })
    .catch(error => {
        console.error('Error publishing comment:', error);
    });
}
//YORUM YAPMA FONKSİYONU END




// POPUP'I KAPATMA FONKSİYONU START

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.remove(); 

       
        fetchPosts();

    }
}
// POPUP'I KAPATMA FONKSİYONU END


 //POST ARAMA YAPMA FONKSİYONU START !!! postedBy kısmı email ile alınıyor hali !!!
// function searchPosts() {
//     //const token = localStorage.getItem("authToken");
//     const token = getToken();
//     const headers = new Headers();

//     headers.append('Authorization', `Bearer ${token}`);
//     headers.append('Content-Type', 'application/json');
//     const searchQuery = document.getElementById('searchInput').value;
    

//     fetch(`http://localhost:8088/post/search/by?name=${searchQuery}`, {
//         method: 'GET',
//         headers: headers,
//     })
//     .then(response => response.json())
//     .then(posts => {
//         console.log(posts.data);
//         const postList = document.getElementById("postList");
//         if (posts.length === 0) {
//             postList.innerHTML = "<p>No posts found</p>";
//         } else {
//             let htmlContent = '';
//             posts.data.forEach(post => {
//                 const imgUrl = `http://localhost:8088/upload/images/${post.img}`;
                
//                 htmlContent += `
//                     <div class="post">
//                         <h3>${post.name}</h3>
//                         <p>Posted by: ${post.postedBy}</p>
//                         <p>Date: ${new Date(post.date).toLocaleString()}</p>
//                         <div class="post-content">
//                             <img src="${imgUrl}" alt="Post Image">
//                             <p>${post.content}</p>
//                         </div>
//                         <div class="post-footer">
//                             <div class="button-container">
//                                 <button onclick="likePost(${post.id}, this)"><i class="fas fa-thumbs-up"></i> Like (${post.likeCount})</button>
//                                 <button><i class="fas fa-comment"></i> View (${post.viewCount})</button>
//                                 <button onclick="openPostPopup(${post.id})"><i class="fas fa-eye"></i> View Post</button>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//             });

//             postList.innerHTML = htmlContent;
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching posts:', error);
//     });
// }
 //POST ARAMA YAPMA FONKSİYONU END !!! postedBy kısmı email ile alınıyor hali !!!



//POST ARAMA YAPMA FONKSİYONU START
function searchPosts() {
    const token = getToken();
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    const searchQuery = document.getElementById('searchInput').value;

    fetch(`http://localhost:8088/post/search/by?name=${searchQuery}`, {
        method: 'GET',
        headers: headers,
    })
    .then(response => response.json())
    .then(posts => {
        const postList = document.getElementById("postList");
        if (!posts.data || posts.data.length === 0) {
            postList.innerHTML = "<p>No posts found</p>";
            return;
        }
        
        const emailList = [...new Set(posts.data.map(post => post.postedBy))];
        
        fetchUserNames(emailList)
        .then(emailToNameMap => {
            let htmlContent = '';
            posts.data.forEach(post => {
                const imgUrl = `http://localhost:8088/upload/images/${post.img}`;
                const postedByName = emailToNameMap[post.postedBy] || post.postedBy; // Adını mapten al ya da email göster

                htmlContent += `
                    <div class="post">
                        <p style="text-align: left;"><i class="fas fa-user"></i> : ${postedByName}</p>
                        <p style="text-align: left;"><i class="fas fa-calendar-alt"></i> : ${new Date(post.date).toLocaleString()}</p>
                        <h3>${post.name}</h3>
                        <div class="post-content">
                            <img src="${imgUrl}" alt="Post Image">
                            <p>${post.content}</p>
                        </div>
                        <div class="post-footer">
                            <div class="button-container">
                                <button onclick="likePost(${post.id}, this)"><i class="fas fa-heart"></i> (${post.likeCount})</button>
                                <button><i class="fas fa-comment"></i> (${post.viewCount})</button>
                                <button onclick="openPostPopup(${post.id})"><i class="fas fa-eye"></i> View Post</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            postList.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching user names:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}
//POST ARAMA YAPMA FONKSİYONU END