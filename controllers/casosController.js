const casosRepository = require("../repositories/casosRepository");
const { v4: uuidv4 } = require('uuid');

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

function getAllCasos(req, res) {
	const casos = casosRepository.findAllCases();
	res.json(casos);
}

function getCaseByID(req, res) {
	const caseID = req.params.id;
	const caso = casosRepository.getCaseByID(caseID);
	if (caso.err) {
		return res.json(caso);
	}
	res.json(caso);
}

function insertCase(req, res) {
	const novoCaso = caseModel(req.body);
	const insertedCase = casosRepository.insertCase(novoCaso);
	return res.json(insertedCase);
}

function updateCaseById(req, res){
	const caseID = req.params.id;
	const updatedCase = casosRepository.updateCaseById(caseID, req.body);
	if (updatedCase.err) {
		return res.json(updatedCase);
	}
	return res.json(updatedCase);
}

function patchCaseByID(req, res) {
	const caseID = req.params.id;
	const patchedCase = casosRepository.patchCaseByID(caseID, req.body);
	if (patchedCase.err) {
		return res.json(patchedCase);
	}
	return res.json(patchedCase);
}

function deleteCaseById(req, res) {
	const caseID = req.params.id;
	const deletedCase = casosRepository.deleteCaseById(caseID);
	if (deletedCase.err) {
		return res.json(deletedCase);
	}
	return res.json(deletedCase);
}


module.exports = {
	getAllCasos, getCaseByID, insertCase, updateCaseById, patchCaseByID, deleteCaseById
}