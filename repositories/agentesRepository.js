const { v4: uuidv4 } = require('uuid');
const { createError } = require('../utils/errorHandler');
const { isValidDate } = require('../utils/formatDate');

const caseModel = (req) => {

    if (!(req.nome || req.dataDeIncorporacao || req.cargo)) {
        return {
            err: null,
            msgError: "Campos obrigatórios faltando",
            status: 400
        };
    }

  return {
    id: uuidv4(),
    nome: req.nome,
    dataDeIncorporacao: isValidDate(req.dataDeIncorporacao),
    cargo: req.cargo
  };
};

const agentes = [
    {
        id: uuidv4(),
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    }
];

function findAllAgents() {
    return {
        agentes,
        msg: "Lista de agentes obtida com sucesso",
        status: 200
    };
}

function getAgentByID(id) {
    const agent = agentes.find(a => a.id === id);
    return agent
        ? { agent, msg: "Agente encontrado com sucesso", status: 200 }
        : createError(404, "ID de agente não encontrado");
}

function insertAgent(req) {

    if(req.dataDeIncorporacao && !isValidDate(req.dataDeIncorporacao)) {
        return createError(400, "Data de incorporação inválida");
    };

    const novoAgente = {
        id: uuidv4(),
        nome: req.nome,
        dataDeIncorporacao: isValidDate(req.dataDeIncorporacao),
        cargo: req.cargo
    };

    if (!novoAgente.nome || !novoAgente.dataDeIncorporacao || !novoAgente.cargo) {
        return createError(400, "Campos obrigatórios faltando");
    }

    agentes.push(novoAgente);
    return {
        novoAgente,
        msg: "Agente inserido com sucesso",
        status: 201
    };
}

function updateAgentById(agentID, req) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    delete req.id;

    agentes[index] = {
        nome: req.nome,
        dataDeIncorporacao: isValidDate(req.dataDeIncorporacao),
        cargo: req.cargo
    };

    return {
        msg: "Agente atualizado com sucesso",
        status: 204
    };
}

function patchAgentByID(agentID, req) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    delete req.id;

    agentes[index] = { ...agentes[index], ...req };

    return {
        msg: "Campos de agente atualizados com sucesso",
        status: 204
    };
}

function deleteAgentById(agentID) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    agentes.splice(index, 1);
    return {
        msg: "Agente deletado com sucesso",
        status: 200
    };
}

module.exports = {
    findAllAgents,
    getAgentByID,
    insertAgent,
    updateAgentById,
    patchAgentByID,
    deleteAgentById
};
