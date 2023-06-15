let cl = console.log;
const cardContainer = document.getElementById('cardContainer');
const formContainer = document.getElementById('formContainer');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const addBtn = document.getElementById('addBtn')
const cancleBtn = document.getElementById('cancleBtn');
const updateBtn = document.getElementById('updateBtn')


const fadeModel = document.getElementById('fade-model');
const fadeOverley = document.getElementById('fadeOverley');
const hideFade = document.querySelectorAll('.hideFade');
const deleteBtn = document.getElementById('deleteBtn');
let baseUrl = `https://crud-api-json-default-rtdb.asia-southeast1.firebasedatabase.app/`;
let postUrl = `${baseUrl}posts.json`;
const makeApiCall = (method, apiUrl, body) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, apiUrl);
        xhr.onload = () => {
            xhr.status >= 200 || xhr.status <= 300 ? resolve(xhr.response) : reject(`Somethong went wrong`)
        }
        xhr.send(body)
    })
}

makeApiCall('GET', postUrl)
    .then((res) => {
        let data = JSON.parse(res)
        let postArr = []
        for (const key in data) {
            obj = {
                ...data[key],
                id: key
            }
            postArr.push(obj)
        }
        postsTemp(postArr)
    })
    .catch((err) => {
        cl(err)
    })

const postsTemp = (arr) => {
    let result = '';
    arr.forEach(ele => {
        cardContainer.innerHTML = result +=
            `
                <div class="card my-5 " id = '${ele.id}'>
                    <div class="card-header">
                        <h3>${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-primary" onclick = "OneditHandler(this)">Edit</button>
                    <button type="button" class="btn btn-danger" onclick = "onDeleteHandler(this)">Delete</button>
                    </div>
                </div>
            `
    })
}

const OnsubmitHandler = (e) => {
    e.preventDefault();
    let obj = {
        title: titleControl.value,
        body: contentControl.value
    }
    makeApiCall('POST', postUrl, JSON.stringify(obj))
        .then((res) => {
            let data = JSON.parse(res);
            let card = document.createElement('div');
            card.id = data.name;
            card.className = `card my-5`;
            let result =
            `
                <div class="card-header">
                    <h3>${obj.title}</h3>
                </div>
                <div class="card-body">
                    <p>${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-primary" onclick = "OneditHandler(this)">Edit</button>
                    <button type="button" class="btn btn-danger" onclick = "onDeleteHandler(this)">Delete</button>
                </div>
            `
            card.innerHTML = result;
            cardContainer.prepend(card)
        })
        .catch((err) => {
            cl(err)
        })
        .finally(() => {
            e.target.reset()
        })
}

const OneditHandler = (e) => {
    let editId = e.closest('.card').getAttribute('id');
    localStorage.setItem('editID', editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`
    makeApiCall('GET', editUrl)
        .then((res) => {
            let data = JSON.parse(res)
            titleControl.value = data.title
            contentControl.value = data.body
        })
        .catch((err) => {
            cl(err)
        })
    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
}

const OnupdateHandler = (e) => {
    let updateId = localStorage.getItem('editID');
    localStorage.removeItem('editID')
    let updateUrl = `${baseUrl}posts/${updateId}.json`
    let obj = {
        title: titleControl.value,
        body: contentControl.value
    }
    makeApiCall('PATCH', updateUrl, JSON.stringify(obj))
        .then((res) => {
            let data = JSON.parse(res);
            const updateID = [...document.getElementById(updateId).children];
            updateID[0].innerHTML = `<h3>${data.title}</h3>`;
            updateID[1].innerHTML = `<p>${data.body}</p>`;
        })
        .catch((err) => {
            cl(err)
        })
        .finally(() => {
            formContainer.reset()
        })
}

const onDeleteHandler = (e) => {
    let deleteId = e.closest('.card').getAttribute('id');
    let deleteUrl = `${baseUrl}posts/${deleteId}.json`;
    makeApiCall('DELETE', deleteUrl)
        .then((res) => {
            cl(res)
            const deleteID = document.getElementById(deleteId);
            deleteID.remove()
        })
        .catch((err) => {
            cl(err)
        })
}

const OncancelHandler = (e) => {
    formContainer.reset();
    updateBtn.classList.add('d-none')
    addBtn.classList.remove('d-none')
}



formContainer.addEventListener('submit', OnsubmitHandler)
updateBtn.addEventListener('click', OnupdateHandler)
