const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//mongoose.set('strictQuery', true);
const PessoaSchema = new mongoose.Schema({
    nome: { 
        type: String,
        required: true
    },
    sobrenome: { 
        type: String,
        required: true
    }, 
    profissao: { 
        type: String,
        required: true
    },
    statusProficional: { 
        type: String,
        required: true
    },
    deficiente: {
    type: Boolean,
    },
    isMantenedor: {
        type: Boolean,
        default: false
    },
    data_nasc: {
        type: Date,
        requied: true
    },
    sexo: {
        type: String,
        required: true
    },
    altura: {
        type: String,
    },
    peso: {
        type: Number,
    },
    tipo_sanguineo: {
        type: String,
    },
    renda: {
        valor: { type: mongoose.Schema.Types.Decimal128, default: 0 },
        moeda: { type: String, default: 'BRL' } // Pode ser 'BRL', 'USD', etc.
    },
    documentos: {
        cpf: {
            type: String,
            required: true
        },
        identidade: {
            type: String,
            required: true
        },
        cns: {
            type: String,
        },
        cadUnico: {
            type: String,
        },
        certNasc: {
            folha: { type: String },
            livro: { type: String },
            numOrdem: { type: String }
        },
        certCasamento: {
            folha: { type: String },
            livro: { type: String },
            numRegTermo: { type: String } 
        }
    },
    filiacao: {
        pai: { type: String },
        mae: {type: String }
    },
    creatAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});



const Pessoa = mongoose.model('Pessoa', PessoaSchema);

module.exports = Pessoa;
