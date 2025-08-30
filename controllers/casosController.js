const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { createError } = require('../utils/errorHandler');

function buildCase(data, method){
    const allowed = ['titulo', 'descricao', 'status', 'agente_id'];
    const payload = {};

	if (method === 'patch') {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return { valid: false, message: 'Body vazio: pelo menos um campo deve ser enviado para atualização.' };
        }
    }

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
    
    if (payload.titulo !== undefined) {
        if (typeof payload.titulo !== 'string' || payload.titulo.trim() === '') {
            return { valid: false, message: 'Titulo enviado é invalido, deve ser um texto.' };
        }
    }

    if (payload.descricao !== undefined) {
        if (typeof payload.descricao !== 'string' || payload.descricao.trim() === '') {
            return { valid: false, message: 'Descrição enviada é inválida, deve ser um texto.' };
        }
    }

    if (payload.status !== undefined) {
        if(typeof payload.status !== 'string' || payload.status.trim() === '' 
	      || (payload.status !== 'aberto' && payload.status !== 'solucionado')){
            return { valid: false, message: "Status informado não é valido, deve ser um texto e ser 'aberto' ou 'solucionado'." };
        }
    }

	if (payload.agente_id !== undefined) {
		const validID = validateUUID(payload.agente_id)
		if (validID) {
			return { valid: false, message: validID.message }
		}
		const hasAgentWithID = agentesRepository.getAgentByID(payload.agente_id);
        if(hasAgentWithID.status !== 200){
            return { valid: false, message: hasAgentWithID.message };
        }
    }

    return { valid: true, payload };
}

function validateUUID(id) {
	if (!isUUID(id)) {
		return createError(400, "ID inválido, deve ser UUID");
	}
	return null;
}

function getAllCasos(req, res) {
	const { status, agente_id, } = req.query;
	if (status) {
		if (status !== "aberto" && status !== "solucionado") {
			const error = createError(400, "Status inválido, deve ser 'aberto' ou 'solucionado'");
			return res.status(error.status).json({msg: error.message});
		}
		const result = casosRepository.findByStatus(status);
		return res.status(result.status).json(result.data);
	}

	if (agente_id) {
		const validID = validateUUID(agente_id)
		if (validID) {
			return res.status(validID.status).json({msg: validID.message});
		}
		const result = casosRepository.findByAgent(agente_id);
		return res.status(result.status).json(result.data);
	}

	const result = casosRepository.findAllCases();
	res.status(result.status).json(result.data);
}

function getSearchCases(req, res) {

    const { q } = req.query;

    if (!q) {
        const error = createError(400, "O parâmetro 'q' é obrigatório");
        return res.status(error.status).json({ msg: error.message });
    }

    const result = casosRepository.searchCases(q);
    return res.status(result.status).json(result.data);
}

function getCaseByID(req, res) {
	const valid = validateUUID(req.params.id);
	if (valid){
		return res.status(valid.status).json({msg: valid.message});
	} 
	const caseID = req.params.id;
	const result = casosRepository.getCaseByID(caseID);
	res.status(result.status).json(result.data);
}

function insertCase(req, res) {
	const validCaseData = buildCase(req.body, 'post');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json({msg: error.message});
	}
	const existingAgent = agentesRepository.getAgentByID(req.body.agente_id);
	if (existingAgent.status !== 200) {
		const error = createError(existingAgent.status, existingAgent.msg);
		return res.status(error.status).json({msg: error.message});
	}
	const result = casosRepository.insertCase(validCaseData.payload);
	return res.status(result.status).json(result.data);
}

function updateCaseById(req, res){
	const validID = validateUUID(req.params.id)
	if (validID) {
		return res.status(validID.status).json({msg: validID.message});
	}
	const validCaseData = buildCase(req.body, 'put');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json({msg: error.message});
	}
	const existingAgent = agentesRepository.getAgentByID(req.body.agente_id);
	if (existingAgent.status !== 200) {
		const error = createError(existingAgent.status, existingAgent.message);
		return res.status(error.status).json({msg: error.message});
	}
	const result = casosRepository.updateCaseById(req.params.id, validCaseData.payload);
	return res.status(result.status).json(result.data);
}

function patchCaseByID(req, res) {
	const validID = validateUUID(req.params.id)
	if (validID) {
		return res.status(validID.status).json({msg: validID.message});
	}
	const validCaseData = buildCase(req.body, 'patch');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json({msg: error.message});
	}
	if(req.body.agente_id){
		const existingAgent = agentesRepository.getAgentByID(req.body.agente_id);
		if (existingAgent.status !== 200) {
			const error = createError(existingAgent.status, existingAgent.message);
			return res.status(error.status).json({msg: error.message});
		}
	}
	const result = casosRepository.patchCaseByID(req.params.id, validCaseData.payload);
	return res.status(result.status).json(result.data);
}

function deleteCaseById(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid){
		return res.status(invalid.status).json({msg: invalid.message});
	}
	const result = casosRepository.deleteCaseById(req.params.id);
	res.status(result.status).send();
}


module.exports = {
	getAllCasos,
	getCaseByID,
	getSearchCases,
	insertCase,
	updateCaseById,
	patchCaseByID,
	deleteCaseById
}