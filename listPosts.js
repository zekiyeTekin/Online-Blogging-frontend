 //localStorage.setItem("authToken", "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ6ZWtAZ21haWwuY29tIiwiaWF0IjoxNzI2NTIxNTI2LCJleHAiOjE3MjY1MzAxNjYsImF1dGhvcml0aWVzIjpbIlVTRVIiXX0.2GUOdnJUxP3sdo3MhJi7MSl6nWjCaRe3qqL3yIgPvhUiQ4BE2jrj1ngFopfKee-Y");


 //ÇIKIŞ YAPMA FONKSİYONU START
 document.addEventListener('DOMContentLoaded', () => {
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
    if (!getToken()) {
        redirectToLogin();
    }
  
    // Çıkış bağlantısına tıklama olayını dinleyiciye ekle
    document.getElementById('logoutLink').addEventListener('click', (event) => {
        event.preventDefault();
        logout();
    });
  
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
    const postList = document.getElementById("postList");
    fetchPosts();  // Verileri çekmek için fonksiyon
}

function fetchPosts() {
    //const token = localStorage.getItem("authToken");

    fetch('http://localhost:8088/post/get/posts', {
        mode: 'cors',
        method: 'GET',
        headers:{
             'Authorization': 'application/json',
            'Content-Type': 'application/json'
         }
    })
    .then(response => response.json())
    .then(posts => {
        const postList = document.getElementById("postList");
        console.log(posts.data);

        let htmlContent = '';
        posts.data.forEach(post => {
            htmlContent += `
                <div class="post">
                    <h3>${post.name}</h3>
                    <p>Posted by: ${post.postedBy}</p>
                    <p>Date: ${new Date(post.date).toLocaleString()}</p>
                    <div class="post-content">
                        <img src="${post.img}" alt="Post Image">
                        <p>${post.content}</p>
                    </div>
                    <div class="post-footer">
                        <div class="button-container">
                            <button onclick="likePost(${post.id}, this)"><i class="fas fa-thumbs-up"></i>(${post.likeCount})</button>
                            <button><i class="fas fa-eye"></i>(${post.viewCount})</button>
                            <button onclick="openPostPopup(${post.id})"> View Post</button>  <!-- View Post Butonuna onclick event ekliyoruz -->
                        </div>
                    </div>
                </div>
            `;
        });

        postList.innerHTML = htmlContent;
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}

 //POSTLARI LİSTELEME FONKSİYONU END


 function getToken() {
    return localStorage.getItem('token');
  }

 //POSTLARI BEĞENME FONKSİYONU START
function likePost(postId, buttonElement) {
    //const token = localStorage.getItem("authToken");
    const token = getToken();
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    

    fetch(`http://localhost:8088/post/like/by?id=${postId}`, {
        method: 'PUT',
        headers: headers,
    })
    .then(response => response.json())
    .then(updatedPost => {
        // Güncellenmiş beğeni sayısını butona yansıt
        const likeButton = buttonElement;
        const updatedLikeCount = updatedPost.data.likeCount;
        likeButton.innerHTML = `<i class="fas fa-thumbs-up"></i> Like (${updatedLikeCount})`;
        //console.log(updatedLikeCount);
        // Popup açık ise, popup'taki beğeni sayısını da güncelle
        const popup = document.getElementById('popup');
        if (popup && popup.querySelector('.button-container button')) {
            const popupLikeButton = popup.querySelector('.button-container button');
            popupLikeButton.innerHTML = `<i class="fas fa-thumbs-up"></i> Like (${updatedLikeCount})`;
        }
    })
    .catch(error => {
        console.error('Error liking post:', error);
    });
}
 //POSTLARI BEĞENME FONKSİYONU END



 //POST DETAYINI GÖRÜNTÜLEME FONKSİYONU START
function openPostPopup(postId) {
    //const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8088/post/by?id=${postId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(post => {
        const tagsHtml = Array.isArray(post.data.tags) ? post.data.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        // Popup içerik hazırlama
        //console.log(post.data.tags);
        const popupContent = `

        <div id="popup" class="popup">
    <div class="popup-content">
        <span class="close-btn" onclick="closePopup()">&#x2716;</span>
        <div class="popup-body">
            <div class="popup-details">
                <h3>${post.data.name}</h3>
                <p>Posted by: ${post.data.postedBy}</p>
                <p>Date: ${new Date(post.data.date).toLocaleString()}</p>
                <div class="post-content">
                    <img src="${post.data.img}" alt="Post Image" class="popup-img">
                <p>${post.data.content}</p>
                </div>
                <div class="post-tags" id="post-tags"> ${tagsHtml}</div>
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

        // Yorumları yükle
        loadComments(postId);

         // Popup'u göster
         document.getElementById('popup').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error fetching post details:', error);
    });
}
//POST DETAYINI GÖRÜNTÜLEME FONKSİYONU END




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
        console.log(comments);
        commentsSection.innerHTML = Array.isArray(comments.data) ? comments.data.map(comment => `
            <div class="comment">
                <p><strong>${comment.postedBy}</strong> - ${new Date(comment.createdAt).toLocaleString()}</p>
                <p>${comment.content}</p>
            </div>
        `).join('') : '';
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
    });
}
//YORUMLARI GÖRÜNTÜLEME FONKSİYONU END


//YORUM YAPMA FONKSİYONU START
//BURADA KALDIM--0****************************
function submitComment(postId) {
    //const token = localStorage.getItem("authToken");
    const token = getToken();
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const commentContent = document.getElementById('comment-content').value;
    const postedBy = 'Authenticated User'; // Burada gerçek kullanıcı adını dinamik olarak almanız gerekir.

    const bodyData = {
        content : encodeURIComponent(commentContent),
        postedBy : postedBy
    };

    fetch(`http://localhost:8088/comment/create?postId=${postId}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        loadComments(postId);
        document.getElementById('comment-content').value = ''; // İçeriği temizle
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
        popup.remove(); // Popup'ı DOM'dan kaldır

        // Popup kapatıldığında post listesini yeniden yüklüyoruz
        fetchPosts();

    }
}
// POPUP'I KAPATMA FONKSİYONU END


//POST ARAMA YAPMA FONKSİYONU START
function searchPosts() {
    //const token = localStorage.getItem("authToken");
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
        console.log(posts.data);
        const postList = document.getElementById("postList");
        if (posts.length === 0) {
            postList.innerHTML = "<p>No posts found</p>";
        } else {
            let htmlContent = '';
            posts.data.forEach(post => {
                htmlContent += `
                    <div class="post">
                        <h3>${post.name}</h3>
                        <p>Posted by: ${post.postedBy}</p>
                        <p>Date: ${new Date(post.date).toLocaleString()}</p>
                        <div class="post-content">
                            <img src="${post.img}" alt="Post Image">
                            <p>${post.content}</p>
                        </div>
                        <div class="post-footer">
                            <div class="button-container">
                                <button onclick="likePost(${post.id}, this)"><i class="fas fa-thumbs-up"></i> Like (${post.likeCount})</button>
                                <button><i class="fas fa-comment"></i> View (${post.viewCount})</button>
                                <button onclick="openPostPopup(${post.id})"><i class="fas fa-eye"></i> View Post</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            postList.innerHTML = htmlContent;
        }
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });
}
//POST ARAMA YAPMA FONKSİYONU END








