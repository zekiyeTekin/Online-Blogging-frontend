//localStorage.setItem("token", "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ6ZWtAZ21haWwuY29tIiwiaWF0IjoxNzI2NTIxNTI2LCJleHAiOjE3MjY1MzAxNjYsImF1dGhvcml0aWVzIjpbIlVTRVIiXX0.2GUOdnJUxP3sdo3MhJi7MSl6nWjCaRe3qqL3yIgPvhUiQ4BE2jrj1ngFopfKee-Y");

//login olduğunda ilk login.html sayfası çalışması için 
const token = localStorage.getItem('token');
  
  // Eğer token yoksa login sayfasına yönlendir
  if (!token) {
    window.location.href = 'login.html';
  }


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



function getToken() {
    return localStorage.getItem('token');
}


// document.getElementById("postForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Formun varsayılan submit işlemini engelle

//     const name = document.getElementById("name").value.trim();
//     const content = document.getElementById("content").value.trim();
//     const postedBy = document.getElementById("postedBy").value.trim();
//     const img = document.getElementById("img").value.trim();
//     const tags = document.getElementById("tags").value.trim().split(",").filter(tag => tag.trim() !== "");

//     // Boş alan kontrolü
//     if (!name || !content || !postedBy) {
//         alert("Lütfen gerekli alanları doldurun.");
//         return;
//     }

//     const post = {
//         name: name,
//         content: content,
//         postedBy: postedBy,
//         img: img,
//         tags: tags
//     };

//     console.log("Gönderilen Post Verisi:", post); // Hata ayıklama için

//     fetch('http://localhost:8087/post/create', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(post),
//     })
//     .then(response => {
//         console.log("Response Status:", response.status); // Hata ayıklama için
//         if (!response.ok) {
//             throw new Error('API yanıtında bir hata oluştu.');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Başarıyla Gönderildi:', data); // Hata ayıklama için
//         document.getElementById("result").textContent = "Post başarıyla oluşturuldu!";
//         document.getElementById("result").classList.remove("error");
//         document.getElementById("result").style.display = "block";
//         document.getElementById('postForm').reset();  // Formu Gönderdikten Sonra Temizle
//     })
//     .catch((error) => {
//         console.error('Hata:', error);
//         document.getElementById("result").textContent = "Post oluşturulurken bir hata oluştu.";
//         document.getElementById("result").classList.add("error");
//         document.getElementById("result").style.display = "block";
//     });
// });


//POST OLUŞTURMA FONKSİYONU END



function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
}


//POST OLUŞTURMA FONKSİYONU START
document.getElementById("postForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Formun varsayılan submit işlemini engelle

    const token = getToken();
    const headers = new Headers();

    const decodedToken = parseJwt(token);
    //console.log('Email from token:', decodedToken);
    const username = decodedToken.sub;

    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const fileInput = document.getElementById("img");
    const file = fileInput.files[0];
    


    if (file) {
        const formData = new FormData();
        formData.append("img", file);

        fetch('http://localhost:8088/upload/image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        .then(response => response.text())
        .then(filePath => {
            //console.log('File uploaded successfully:', filePath);

            // Post verilerini JSON olarak gönderme
            const post = {
                name: document.getElementById("name").value.trim(),
                content: document.getElementById("content").value.trim(),
                postedBy: username,
                img: filePath,  // Dosya yolunu ekle
                tags: document.getElementById("tags").value.trim().split(",").filter(tag => tag.trim() !== "")
            };

            return fetch('http://localhost:8088/post/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(post)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API yanıtında bir hata oluştu.');
            }
            return response.json();
        })
        .then(data => {
            //console.log('Başarıyla Gönderildi:', data);
            document.getElementById("result").textContent = "Post başarıyla oluşturuldu!";
            document.getElementById("result").classList.remove("error");
            document.getElementById("result").style.display = "block";
            document.getElementById('postForm').reset();  // Formu Gönderdikten Sonra Temizle
        })
        .catch((error) => {
            console.error('Hata:', error);
            document.getElementById("result").textContent = "Post oluşturulurken bir hata oluştu.";
            document.getElementById("result").classList.add("error");
            document.getElementById("result").style.display = "block";
        });
    }
});
//POST OLUŞTURMA FONKSİYONU END