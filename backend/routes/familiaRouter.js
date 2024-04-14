const express = require('express');
const router = express.Router();
const Familia = require('../models/familiaModel');
const Pessoa = require('../models/pessoaModel');
const bcrypt = require('bcrypt');

// Rota Adicionar Família
router.post('/addFamilia', async (req, res) => {
    try {
        // Verificar se já existe uma família com esse nome
        const existingFamilyName = await Familia.findOne({ 'familyName': req.body.familyName });
        const existingMember = await Familia.findOne( { 'membro._id': req.body._id } );


        if (existingFamilyName) {
            return res.status(400).send("Já existe família com esse nome");
        }

        if (existingMember) {
            return res.status(400).send("Membro ja cadastrado em outra familia");
        }

        // Obter informações de renda dos membros associados
        const membros = await Pessoa.find({ '_id': { $in: req.body.membros }, 'renda.valor': { $exists: true, $ne: null } });

        if (membros.length === 0) {
            return res.status(400).send('Nenhum membro tem a propriedade "renda" definida ou o valor é nulo.');
        }

        // Calcular a média da renda dos membros
        const somaRenda = membros.reduce((total, member) => {
            const valorRenda = parseFloat(member.renda.valor);
            return isNaN(valorRenda) ? total : total + valorRenda;
        }, 0);

        const mediaRenda = somaRenda / membros.length;

        // Criar uma nova família usando o modelo Familia
        const novaFamilia = new Familia(req.body);

        // Associar os membros à nova família
        novaFamilia.membros = req.body.membros;

        // Atribuir a média da renda à propriedade rendaFamiliar como um objeto
        novaFamilia.rendaFamiliar = { valor: mediaRenda, moeda: 'BRL' };

        // Salvar a nova família no banco de dados
        await novaFamilia.save();

        // Obter informações detalhadas dos membros da família
        const membersDetails = await Pessoa.find({ '_id': { $in: novaFamilia.membros } });

        res.status(200).send({ message: 'Família registrada com sucesso!', membersDetails });
    } catch (error) {
        console.error(error);

        // Verificar se é uma exceção do Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).send('Erro de validação ao registrar Família');
        }

        res.status(500).send('Erro ao registrar Família');
    }
});

// Rota Deletar Família e pessoas associadas a elas
router.delete('/delFamilyPessoas/:id', async (req, res) => {
    try {
        // Verificar se a família existe
        const familia = await Familia.findById(req.params.id);

        if (!familia) {
            return res.status(404).send("Família não encontrada");
        }

        // Encontrar IDs das pessoas associadas à família
        const membrosIds = familia.membros;

        // Excluir as pessoas associadas à família
        for (const pessoaId of membrosIds) {
            await Pessoa.findByIdAndDelete(pessoaId);
        }

        // Excluir a família
        await familia.remove();

        res.status(200).send({ message: 'Família e pessoas associadas excluídas com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir Família');
    }
});

// Rota para deletar apenas a família, deixando as pessoas cadastradas
router.delete('/delFamilia/:id', async (req, res) => {
    try {
        // Verificar se a família existe
        const familia = await Familia.findById(req.params.id);

        if (!familia) {
            return res.status(404).send("Família não encontrada");
        }

        // Excluir a família
        await familia.remove();

        res.status(200).send({ message: 'Família excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir Família');
    }
});

// Rota para obter lista de famílias em ordem crescente por data de registro
router.get('/listFamilias', async (req, res) => {
    try {
        // Buscar todas as famílias ordenadas por data de registro crescente
        const familias = await Familia.find().sort({ createdAt: 1 });

        res.status(200).send({ familias });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter lista de famílias');
    }
});

//Rota para obter familia por cpf de membros
router.get('/findFamiliaByCpf/:cpf', async (req, res) => {
    const cpf = req.params.cpf;
  
    try {
      // Consulta no banco de dados para obter a pessoa pelo CPF
      const pessoa = await Pessoa.findOne({ 'documentos.cpf': cpf });
  
      if (pessoa) {
        // Se encontrar a pessoa, obtenha o ID
        const pessoaId = pessoa._id;
  
        // Consulta no banco de dados para encontrar a família que tem o ID da pessoa nos membros
        const familia = await Familia.findOne({ membros: pessoaId });
  
        if (familia) {
          // Se encontrar a família, retorna o nome da família junto com as informações da pessoa
          res.json({
            id: pessoaId,
            nome: pessoa.nome,
            familia: { id: familia._id, nome: familia.familyName }
          });
        } else {
          // Se não encontrar a família, retorne um status indicando que a família não foi encontrada
          res.status(404).json({ message: 'Família não encontrada' });
        }
      } else {
        // Se a pessoa não for encontrada, retorne um status indicando que a pessoa não foi encontrada
        res.status(404).json({ message: 'Pessoa não encontrada' });
      }
    } catch (error) {
      // Em caso de erro, retorne um status de erro
      console.error(error);
      res.status(500).json({ message: 'Erro ao consultar a pessoa' });
    }
});


// Rota Atualizar Família
router.put('/updateFamilia/:id', async (req, res) => {
    try {
        // Verificar se a família existe
        const familia = await Familia.findById(req.params.id);

        if (!familia) {
            return res.status(404).send("Família não encontrada");
        }

        // Verificar se o novo nome da família já existe
        if (req.body.familyName) {
            const existingFamilyName = await Familia.findOne({ 'familyName': req.body.familyName });

            if (existingFamilyName && existingFamilyName._id.toString() !== req.params.id) {
                return res.status(400).send("Já existe uma família com esse nome");
            }
        }

        // Atualizar os campos da família com base nos dados recebidos
        familia.familyName = req.body.familyName || familia.familyName;
        familia.membros = req.body.membros || familia.membros;
        familia.logradouro.cep = req.body.logradouro.cep || familia.logradouro.cep;
        familia.logradouro.rua = req.body.logradouro.rua || familia.logradouro.rua;
        familia.logradouro.numero = req.body.logradouro.numero || familia.logradouro.numero;
        familia.logradouro.complemento = req.body.logradouro.complemento || familia.logradouro.complemento;
        familia.logradouro.bairro = req.body.logradouro.bairro || familia.logradouro.bairro;
        familia.logradouro.cidade = req.body.logradouro.cidade || familia.logradouro.cidade;
        familia.logradouro.uf = req.body.logradouro.uf || familia.logradouro.uf;

        // Calcular a média da renda
        familia.rendaFamiliar = await calcularMediaRenda(req.body.membros);

        // Salvar as atualizações no banco de dados
        await familia.save();

        // Obter informações detalhadas dos membros da família
        const membersDetails = await Pessoa.find({ '_id': { $in: familia.membros } });

        res.status(200).send({ message: 'Família atualizada com sucesso!', membersDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar Família');
    }
});

// Função para calcular a média da renda
async function calcularMediaRenda(membros) {
    try {
        // Verificar se há membros na família
        if (membros && membros.length > 0) {
            // Obter informações de renda dos membros associados
            const membrosComRenda = await Pessoa.find({ '_id': { $in: membros }, 'renda.valor': { $exists: true, $ne: null } });

            if (membrosComRenda.length === 0) {
                return { valor: 0, moeda: 'BRL' };
            }

            // Calcular a média da renda dos membros
            const somaRenda = membrosComRenda.reduce((total, member) => {
                const valorRenda = parseFloat(member.renda.valor);
                return isNaN(valorRenda) ? total : total + valorRenda;
            }, 0);

            const mediaRenda = somaRenda / membrosComRenda.length;

            return { valor: mediaRenda, moeda: 'BRL' };
        } else {
            return { valor: 0, moeda: 'BRL' };
        }
    } catch (error) {
        console.error('Erro ao calcular a média da renda:', error);
        throw error;
    }
}



module.exports = router;
