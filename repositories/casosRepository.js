const { v4: uuidv4 } = require('uuid');
const { createError } = require('../utils/errorHandler')

const caseModel = (req) => {

    if (req.status !== "aberto" && req.status !== "solucionado") {
        return {
            err: null,
            msgError: "status inválido, deve ser 'aberto' ou 'solucionado'",
            status: 400
        };
    }

  return {
    id: uuidv4(),
    titulo: req.titulo,
    descricao: req.descricao,
    status: req.status,
    agente_id: req.agente_id
  };
};


const cases = [
    {
        id: uuidv4(),
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    
    },

]

function findAllCases() {
    return {
        cases,
        msg: "Lista de casos obtida com sucesso",
        status: 200
    }
}

function getCaseByID(id) {
    const caseFounded = cases.find((caseItem) => caseItem.id === id);

    return caseFounded ? 
        {
            case: caseFounded,
            msg: "Caso encontrado com sucesso",
            status: 200
        } : 
        createError(404, "ID de caso não encontrado");
}

function insertCase(req){
    const novoCaso = caseModel(req);
    cases.push(novoCaso);
    return {
        novoCaso,
        msg: "Caso inserido com sucesso",
        status: 201
    };
}

function updateCaseById(caseID, req){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado");
    }

    const updatedCase = caseModel(req);

    delete req.id;

    cases[indexCase] = updatedCase;

    return {
            msg: "Caso atualizado com sucesso",
            status: 204
        };
}

function patchCaseByID(caseID, req){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado")
    }

    delete req.id;

    const patchedCase = { ...cases[indexCase], ...req };
    cases[indexCase] = patchedCase;

    return {
        msg: "Campos de caso informado, foram atualizados com sucesso.",
        status: 204
    };
}

function deleteCaseById(caseID){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado");
    }

    cases.splice(indexCase, 1);
    return {
        msg: "Caso deletado com sucesso",
        status: 200
    };
}

module.exports = {
    findAllCases, getCaseByID, insertCase, updateCaseById, patchCaseByID, deleteCaseById
}