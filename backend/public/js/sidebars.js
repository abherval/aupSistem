let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
    arrowParent.classList.toggle("showMenu");
  });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

function changeMainContent(content) {
  // Lógica para carregar um novo conteúdo na div #main-content
  fetch('/getMainContent', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: content })
  })
  .then(response => response.text())
  .then(data => {
      document.getElementById('main-content').innerHTML = data;
  })
  .catch(error => {
      console.error('Erro ao carregar conteúdo:', error);
  });
}
