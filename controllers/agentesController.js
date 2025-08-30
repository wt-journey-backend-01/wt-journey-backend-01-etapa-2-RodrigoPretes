const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { createError } = require('../utils/errorHandler');
const casosRepository = require('../repositories/casosRepository');
const { isValidDate } = require("../utils/formatDate");

function buildAgent(data, method) {
    const allowed = ['nome', 'dataDeIncorporacao', 'cargo'];
    const payload = {};

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, message: 'Body inválido: esperado um objeto.' };
    }

    if(method !== 'patch'){
        for (const k of allowed) {
            if (data[k] === undefined || data[k] === null || (typeof data[k] === 'string' && data[k].trim() === '')) {
                return { valid: false, message: `Parâmetro obrigatório ausente ou vazio: ${k}` };
            }
        }
    }
    else{
        if(data.id){
            return { valid: false, message: `ID não pode ser sobrescrito.`}
        }
    }


    if(data.id){
        return { valid: false, message: `ID não pode ser sobrescrito.`}
    }

    for (const k of allowed) {
        if (Object.prototype.hasOwnProperty.call(data, k) && data[k] !== undefined) {
            payload[k] = data[k];
        }
    }
    
    if (payload.nome !== undefined) {
        if (typeof payload.nome !== 'string' || payload.nome.trim() === '') {
            return { valid: false, message: 'Nome inválido' };
        }
    }

    if (payload.cargo !== undefined) {
        if (typeof payload.cargo !== 'string' || payload.cargo.trim() === '') {
            return { valid: false, message: 'Cargo inválido' };
        }
    }

    if (payload.dataDeIncorporacao !== undefined) {
        if(!isValidDate(payload.dataDeIncorporacao)){
            return { valid: false, message: "Parâmetro enviado não é uma data válida." };
        }
    }

    return { valid: true, payload };
}

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "ID inválido, deve ser UUID");
  }
}

function getAllAgentes(req, res) {
    const { cargo, sort } = req.query;

    if (cargo) {
        const result = agentesRepository.findByCargo(cargo);
        return res.status(result.status).json(result.data);
    }

    if (sort){
        if((sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao')) {
            const result = agentesRepository.sortByIncorporation(sort);
            return res.status(result.status).json(result.data);
        }else{
            const error = createError(400, "Parametros de ordenação inválidos!");
            return res.status(error.status).json({msg: error.message});
        }
    }
    const result = agentesRepository.findAllAgents();
    res.status(result.status).json(result.data);
}

function getAgenteByID(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid){
        return res.status(invalid.status).json(invalid);
    } 
    const result = agentesRepository.getAgentByID(req.params.id);
    res.status(result.status).json(result.data);
}

function insertAgente(req, res) {
    const buildedAgent = buildAgent(req.body, 'post');
    if (!buildedAgent.valid) {
        const error = createError(400, buildedAgent.message);
        return res.status(error.status).json({msg: error.message});
    }
    const result = agentesRepository.insertAgent(buildedAgent.payload);
    res.status(result.status).json(result.data);
}

function updateAgenteById(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid){
        return res.status(invalid.status).json(invalid);
    } 
    const buildedAgent = buildAgent(req.body, 'put');
    if (!buildedAgent.valid) {
        const error = createError(400, buildedAgent.message);
        return res.status(error.status).json({msg: error.message});
    }
    const result = agentesRepository.updateAgentById(req.params.id, buildedAgent.payload);
    res.status(result.status).json(result.data);
}

function patchAgenteByID(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid){
        return res.status(invalid.status).json(invalid);
    } 
    const validAgentPatch = buildAgent(req.body, 'patch');
    if (!validAgentPatch.valid) {
        const error = createError(400, validAgentPatch.message);
        return res.status(error.status).json({msg: error.message});
    }
    const result = agentesRepository.patchAgentByID(req.params.id, validAgentPatch.payload);
    res.status(result.status).json(result.data);
}

function deleteAgenteById(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid){
        return res.status(invalid.status).json(invalid);
    }
    const result = agentesRepository.deleteAgentById(req.params.id);
    res.status(result.status).send();
}

module.exports = {
    getAllAgentes,
    getAgenteByID,
    insertAgente,
    updateAgenteById,
    patchAgenteByID,
    deleteAgenteById
};
