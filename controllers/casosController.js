const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { createError } = require('../utils/errorHandler');

const caseModel = (data) => {

    if (data?.status !== "aberto" && data?.status !== "solucionado") {
        return {
            err: null,
            msgError: "status inválido, deve ser 'aberto' ou 'solucionado'",
            status: 400
        };
    }

  return {
    id: uuidv4(),
    titulo: data.titulo,
    descricao: data.descricao,
    status: data.status,
    agente_id: data.agente_id
  };
};

function validateCaseData(data, isPatch) {
  if ((!data.titulo || !data.descricao || !data.status || !data.agente_id) && !isPatch) {
    return { valid: false, message: "Campos obrigatórios faltando" };
  }
  if (data.status && (data?.status !== "aberto" && data?.status !== "solucionado") && isPatch) {
    return { valid: false, message: "Status inválido, deve ser 'aberto' ou 'solucionado'" };
  }
  return { valid: true };
}

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "ID inválido, deve ser UUID");
  }
}

function getAllCasos(req, res) {
	const { status, agente_id } = req.query;

	if (status) {
		if (status !== "aberto" && status !== "solucionado") {
			return res.status(400).json({ msg: "Status inválido. Deve ser 'aberto' ou 'solucionado'" });
		}
		const result = casosRepository.findByStatus(status);
		return res.status(result.status).json(result.data);
	}

	if (agente_id) {
		if (!isUUID(agente_id)) {
			return res.status(400).json({ msg: "ID de agente não fornecido ou inválido" });
		}
		const result = casosRepository.findByAgent(agente_id);
		return res.status(result.status).json(result.data);
	}

	const casos = casosRepository.findAllCases();
	res.status(casos.status).json(casos.data);
}

function getCaseByID(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const caseID = req.params.id;
	const caso = casosRepository.getCaseByID(caseID);
	res.status(caso.status).json(caso.data);
}

function insertCase(req, res) {
	const validation = validateCaseData(req.body, false);
	if (!validation.valid) {
		return res.status(400).json({ msg: validation.message });
	}
	const agenteExistente = agentesRepository.getAgentByID(req.body.agente_id);
	if (agenteExistente.status === 404) {
		return res.status(404).json({ msg: "Agente não encontrado para o agente_id fornecido" });
	}
	const novoCaso = caseModel(req.body);
	const insertedCase = casosRepository.insertCase(novoCaso);
	return res.status(insertedCase.status).json(insertedCase.data);
}

function updateCaseById(req, res){
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const validation = validateCaseData(req.body, false);
	if (!validation.valid) {
		return res.status(400).json({ msg: validation.message });
	}
	const caseID = req.params.id;
	const updatedCase = casosRepository.updateCaseById(caseID, req.body);
	return res.status(updatedCase.status).send();
}

function patchCaseByID(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const validation = validateCaseData(req.body, true);
	if (!validation.valid) {
		return res.status(400).json({ msg: validation.message });
	}
	const caseID = req.params.id;
	const patchedCase = casosRepository.patchCaseByID(caseID, req.body);
	return res.status(patchedCase.status).send();
}

function deleteCaseById(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const caseID = req.params.id;
	const deletedCase = casosRepository.deleteCaseById(caseID);
	return res.status(deletedCase.status).json(deletedCase.msg);
}


module.exports = {
	getAllCasos, getCaseByID, insertCase, updateCaseById, patchCaseByID, deleteCaseById
}