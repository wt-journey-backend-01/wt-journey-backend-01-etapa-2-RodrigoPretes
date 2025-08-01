const { v4: uuidv4 } = require('uuid');
const { createError } = require('../utils/errorHandler');
const { isValidDate } = require('../utils/formatDate');

const caseModel = (req) => {
  return {
    id: uuidv4(),
    nome: req.nome,
    dataDeIncorporacao: isValidDate(req.dataDeIncorporacao) ? req.dataDeIncorporacao : null,
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

function findByCargo(cargo) {
    const result = agentes.filter(agent => agent.cargo.toLowerCase() === cargo.toLowerCase());
    return {
        status: 200,
        data: result
    };
}

function sortByName(order) {
    const sorted = [...agentes].sort((a, b) => {
        if (order === 'asc') return a.nome.localeCompare(b.nome);
        else return b.nome.localeCompare(a.nome);
    });
    return {
        status: 200,
        data: sorted
    };
}

function insertAgent(req) {

    if(req.dataDeIncorporacao && !isValidDate(req.dataDeIncorporacao)) {
        return createError(400, "Data de incorporação inválida");
    };

    const novoAgente = caseModel(req);


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

    agentes[index] = {
        id: agentes[index].id,
        nome: req.nome,
        dataDeIncorporacao: isValidDate(req.dataDeIncorporacao),
        cargo: req.cargo
    };

    return {
        status: 204
    };
}

function patchAgentByID(agentID, req) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    if(req.id && req.id !== caseID) {
        return createError(400, "ID pode ser sobrescrito");
    }

    agentes[index] = { ...agentes[index], ...req };

    return {
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
    findByCargo,
    sortByName,
    getAgentByID,
    insertAgent,
    updateAgentById,
    patchAgentByID,
    deleteAgentById
};
