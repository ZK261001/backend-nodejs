let tasks = [
    { id: 1, title: "Nau com", isCompleted: false },
    { id: 2, title: "Rua bat", isCompleted: false },
];
let nextId = 3;

const findAll = () => {
    return tasks;
};

const findOne = (id) => {
    return tasks.find((task) => task.id === id);
};

const create = ({ title }) => {
    const newTask = {
        id: nextId++,
        title,
        isCompleted: false,
    };
    tasks.push(newTask);
    return newTask;
};

module.exports = { findAll, findOne, create };
