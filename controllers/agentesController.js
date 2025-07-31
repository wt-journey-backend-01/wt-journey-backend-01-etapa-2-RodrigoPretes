const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4 } = require('uuid');

const caseModel = (req) => {
  return {
    id: uuidv4(),
    nome: req.nome,
    dataDeIncorporacao: req.date,
    cargo: req.cargo
  };
};

function getAllAgentes(req, res) {
    const result = agentesRepository.findAllAgents();
    res.status(result.status).json(result);
}

function getAgenteByID(req, res) {
    const result = agentesRepository.getAgentByID(req.params.id);
    res.status(result.status).json(result);
}

function insertAgente(req, res) {
    const novoAgente = caseModel(req.body);
    const result = agentesRepository.insertAgent(novoAgente);
    res.status(result.status).json(result);
}

function updateAgenteById(req, res) {
    const result = agentesRepository.updateAgentById(req.params.id, req.body);
    res.status(result.status).json(result);
}

function patchAgenteByID(req, res) {
    const result = agentesRepository.patchAgentByID(req.params.id, req.body);
    res.status(result.status).json(result);
}

function deleteAgenteById(req, res) {
    const result = agentesRepository.deleteAgentById(req.params.id);
    res.status(result.status).json(result);
}

module.exports = {
    getAllAgentes,
    getAgenteByID,
    insertAgente,
    updateAgenteById,
    patchAgenteByID,
    deleteAgenteById
};
