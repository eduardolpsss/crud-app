// Testador de eventos
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

});

// Adicionando função ao botão Add Name
const addBtn = document.querySelector('#add-name-btn')

addBtn.onclick = function(){
    // Pegando o valor inserido no input
    const nameInput = document.querySelector('#name-input');
    const user_name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ user_name : user_name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

// Pegando elemento da tabela e criando nova linha
function insertRowIntoTable(data){
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
    
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id_user}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id_user}>Edit</td>`;


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
    data.forEach(function ({id_user, user_name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id_user}</td>`;
        tableHtml += `<td>${user_name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id_user}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id_user}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}