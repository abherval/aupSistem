const express = require('express');
const router = express.Router();
const Pessoa = require('../models/pessoaModel');
const bcrypt = require('bcrypt');

router.post('/addPessoa', async (req, res) => {
    try {
        // Inicio das validações

        const existinPessoaCPF = await Pessoa.findOne( { 'documentos.cpf': req.body.documentos.cpf } );
        const existinPessoarRG = await Pessoa.findOne( { 'documentos.identidade': req.body.documentos.identidade } );
        const existinPessoacadUnico = await Pessoa.findOne( { 'documentos.cadUnico': req.body.documentos.cadUnico } );
        const existinPessoaCNS = await Pessoa.findOne( { 'documentos.cns': req.body.documentos.cns } ); 
    
        if(req.body.documentos.cpf.toString().length != 11 || /^(\d)\1{10}$/.test(req.body.documentos.cpf) || req.body.documentos.cpf == null || req.body.documentos.cpf == "" ) {

            return res.status(400).send("Tenha certeza de que esta digitando os dados do CPF corretamente");
      }
             
        if (existinPessoaCPF) {
            return res.status(400).send('CPF ja registrado');
        }

        if (existinPessoarRG) {
            return res.status(400).send('RG ja registrado');
        }

        if (existinPessoacadUnico) {
            return res.status(400).send('CadUnico ja registrado');
        }

        if (existinPessoaCNS) {
            return res.status(400).send('Carteira do SUS ja registrado');
        }

        const pessoa = new Pessoa(req.body);
        await pessoa.save();
        res.status(200).send('Pessoa registrada com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao registrar Pessoa');
    }
});


module.exports = router;
