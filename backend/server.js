const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const path = require('path');



//Rotas (Routes)
const authRoutes = require('./routes/authRoutes');
const pessoaRouter = require('./routes/pessoaRouter');
const familiaRouter = require('./routes/familiaRouter');

//Config
const dbName = "aupBD";
const port = 3000;

/*
// EJS para renderizar paginas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'))
*/

app.use(cors());
app.use(express.json()); // para parsing de application/json
app.use(express.static('public'));



// Prefixo das rotas de autenticação (/api/auth)
app.use('/api/auth', authRoutes);


app.use('/pessoa', pessoaRouter);

app.use('/familia', familiaRouter);

//Atrelar Rotas do Express




//Conexao com MongoDB
mongoose.connect(
    `mongodb://localhost:27017/${dbName}` 

);








// Rota raiz renderizando a página de login
/*
app.get('/', (req, res) => {
    res.render('login'); // Ajuste conforme necessário
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { mainContent: 'partials/mainContent1' });
});
*/
//Rota teste
app.get('/', (req, res) => {
    res.json({ message: "Rota teste"}); // Ajuste conforme necessário
});





//middlewares






app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
