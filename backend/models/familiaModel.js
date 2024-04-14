const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//mongoose.set('strictQuery', true);
const FamiliaSchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: true
    },
    
    membros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pessoa'
    }],
    

    rendaFamiliar: {
        valor: { type: Number, default: 0 }, // Modificado para aceitar números
        moeda: { type: String, default: 'BRL' } // Pode ser 'BRL', 'USD', etc.
    },
    logradouro: {
        cep: { type: String, required: true },
        rua: { type: String, required: true },
        numero: { type: String },
        complemento: { type: String },
        bairro: { type: String, required: true },
        cidade: {type: String, rquired: true },
        uf: {type: String, rquired: true }
    },
    creatAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});


const Familia = mongoose.model('Familia', FamiliaSchema)
module.exports = Familia;

