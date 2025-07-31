const agentesRepository = require("../repositories/agentesRepository");

function getAllAgentes(req, res) {
    const result = agentesRepository.findAllAgents();
    res.json(result);
}

function getAgenteByID(req, res) {
    const result = agentesRepository.getAgentByID(req.params.id);
    res.status(result.status).json(result);
}

function insertAgente(req, res) {
    const result = agentesRepository.insertAgent(req.body);
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
