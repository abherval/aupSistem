function login() {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const alertLogin = document.getElementById('alertLogin');

    const data = {
        email: email,
        password: password
    };

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text(); // Alteração: Tentar obter o texto da resposta
        }
    })
    .then(data => {
        if (typeof data === 'object') {
            // Redirecionar o usuário para a rota do dashboard
            window.location.href = data.redirectTo;
        } else {
            // Exibir mensagem de erro na tag alertLogin
            alertLogin.textContent = data || 'Erro ao fazer login';
            alertLogin.classList.remove('d-none');  // Remover a classe d-none para mostrar a mensagem
        }
    })
    .catch(error => {
        // Exibir mensagem de erro na tag alertLogin
        alertLogin.textContent = error.message || 'Erro ao fazer login';
        alertLogin.classList.remove('d-none');  // Remover a classe d-none para mostrar a mensagem
    });
}
