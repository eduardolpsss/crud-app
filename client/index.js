// Testador de eventos
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

// Adicionando funcionalidade ao botão Delete
document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete-row-btn btn btn-danger") {
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit-row-btn btn btn-light") {
        hendleEditRow(event.target.dataset.id);
    }
});

// Adicionando funcionalidade ao botão Edit e Search
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

// Função get específica por nome
searchBtn.onclick = function () {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

// Função delete para a linha pelo id seguida de um reaload na página para atulizar dados da tabela
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}

// Função para mostrar a interface de usuário responsável pela edição do nome na tabela
function hendleEditRow(id) {
    const updateSection = document.querySelector('#section-update-row');
    updateSection.hidden = false;

    // Pegando os dados inseridos e incluindo o id do item para identificação
    document.querySelector('#update-name-input').dataset.id = id;
}

// Adicionando função onclick no botão Edit
updateBtn.onclick = function () {
    const updateNameInput = document.querySelector('#update-name-input');

    console.log(updateNameInput);

    fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateNameInput.dataset.id,
                name: updateNameInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
}

// Adicionando funcionalidade ao botão Add Name
const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
    // Pegando o valor inserido no input
    const nameInput = document.querySelector('#name-input');
    const user_name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                user_name: user_name
            })
        })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));
}

// Pegando elemento da tabela e criando nova linha
function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const checkTableDataState = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn btn btn-danger" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn btn btn-light" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>"

    // Checando se há dados na tabela, atualizando se tiver dados, criando nova linha se não tiver dados
    if (checkTableDataState) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

// Função para informar quando a tabela estiver vazia
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');


    // Caso não tenha dados, printar mensagem dizendo
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    // Caso tenha dados, printar linhas da tabela
    let tableHtml = "";

    // Printando a tabela caso possua dados (incluindo botões para exclusão e edição do conteúdo)
    data.forEach(function ({
        id,
        user_name,
        date_added
    }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${user_name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn btn btn-danger"" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn btn btn-light" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

// Implementação do switch color no projeto
const html = document.querySelector('html')

const getStyle = (element, style) =>
    window
    .getComputedStyle(element)
    .getPropertyValue(style)

const initialColors = {
    bg: getStyle(html, '--bg'),
    colorHeadings: getStyle(html, '--color-headings'),
    colorText: getStyle(html, '--color-text'),
}

const darkMode = {
    bg: '#FCFCFC',
    colorHeadings: '#3664FF',
    colorText: '#121212',
}

const transformKey = key =>
    '--' + key.replace(/([A-Z])/, '-$1').toLowerCase()

const changeColors = (colors) => {
    Object.keys(colors).map(key =>
        html.style.setProperty(transformKey(key), colors[key])
    )
}

const checkbox = document.querySelector('input[name=switch-theme]')

const checkboxColorMode = JSON.parse(localStorage.getItem('color-mode'))

if (checkboxColorMode) {
    checkbox.checked = checkboxColorMode
    changeColors(darkMode)
}

checkbox.addEventListener('change', ({
    target
}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)

    localStorage.setItem('color-mode', target.checked)
})