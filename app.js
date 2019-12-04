import Http from './lib.js';
const http = new Http('https://api-7-8.herokuapp.com');

const rootEl = document.getElementById('root');
const addFormEl = document.createElement('form');
addFormEl.className = 'form-inline mb-2';
addFormEl.innerHTML = `
    <div class="form-group">
        <input class="form-control" data-id="content">
    </div>
    <select class="custom-select" data-id="type">
        <option value="regular">Обычный</option>
        <option value="image">Изображение</option>
        <option value="audio">Аудио</option>
        <option value="video">Видео</option>
    </select>  
    <button class="btn btn-primary">Ok</button>
`;

rootEl.appendChild(addFormEl);
const contentEl = addFormEl.querySelector('[data-id=content]');
contentEl.value = localStorage.getItem('content');
contentEl.addEventListener('input', (evt) => {
    localStorage.setItem('content', evt.currentTarget.value);
});

const typeEl = addFormEl.querySelector('[data-id=type]');
typeEl.value = localStorage.getItem('type');
typeEl.addEventListener('input', (evt) => {
    localStorage.setItem('type', evt.content.value);
});

addFormEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = {
        content: contentEl.value,
        type: typeEl.value,
    };
    http.postRequest('/posts', (evt) => {
        loadData();
        contentEl.value = '';
        localStorage.removeItem('link');
    }, handleError, JSON.stringify(data), [{ name: 'Content-Type', value: 'application/json' }]);
});

const listEl = document.createElement('div');
rootEl.appendChild(listEl);



const rebuildList = (evt) => {
    const items = JSON.parse(evt.currentTarget.responseText);
    listEl.innerHTML = '';

    items.sort((a, b) => {
        return a.likes - b.likes;
    });

    for (const item of items) {
        const postEl = document.createElement('div');
        postEl.className = 'card mb-2';
        if (item.type === 'regular') {
            postEl.innerHTML = `
                    <div class="card-body">
                        <div class="card-text">${item.content}</div>
                        <button class="btn">♡ ${item.likes}</button>
                        <button class="btn btn-primary" data-action="like">like</button>
                        <button class="btn btn-danger" data-action="dislike">dislike</button>
                        <button class="btn btn-danger" data-action="remove">x</button>
                    </div>
                `;
        } else if (item.type === 'image') {
            postEl.innerHTML = `
                    <img src="${item.content}" class="card-img-top">
                    <div class="card-body">
                        <button class="btn">♡ ${item.likes}</button>
                        <button class="btn btn-primary" data-action="like">like</button>
                        <button class="btn btn-danger" data-action="dislike">dislike</button>
                        <button class="btn btn-danger" data-action="remove">x</button>
                    </div>
                `;
        } else if (item.type === 'audio') {
            postEl.innerHTML = `
                    <audio src="${item.content}" class="card-audio-top">
                    <div class="card-body">
                        <button class="btn">♡ ${item.likes}</button>
                        <button class="btn btn-primary" data-action="like">like</button>
                        <button class="btn btn-danger" data-action="dislike">dislike</button>
                        <button class="btn btn-danger" data-action="remove">x</button>
                    </div>
                `;
        } else if (item.type === 'video') {
            postEl.innerHTML = `
                    <video src="${item.content}" class="card-video-top">
                    <div class="card-body">
                        <button class="btn">♡ ${item.likes}</button>
                        <button class="btn btn-primary" data-action="like">like</button>
                        <button class="btn btn-danger" data-action="dislike">dislike</button>
                        <button class="btn btn-danger" data-action="remove">x</button>
                    </div>
                `;
        } else {
            // Показываем обычный -> TODO: вам нужно добавить type в посты на сервере
            postEl.innerHTML = `
                    <div class="card-body">
                        <div class="card-text">${item.content}</div>
                        <button class="btn">♡ ${item.likes}</button>
                        <button class="btn btn-primary" data-action="like">like</button>
                        <button class="btn btn-danger" data-action="dislike">dislike</button>
                        <button class="btn btn-danger" data-action="remove">x</button>
                    </div>
                `;
        }

        postEl.querySelector('[data-action=like]').addEventListener('click', () => {
            // TODO: like item
        });
        postEl.querySelector('[data-action=dislike]').addEventListener('click', () => {
            // TODO: dislike item
        });
        postEl.querySelector('[data-action=remove]').addEventListener('click', () => {
            http.deleteRequest(`/posts/${item.id}`, loadData, handleError);
        });
        listEl.appendChild(postEl);
    };
};
const handleError = (evt) => {
    console.log(evt);
};
const loadData = () => {
    http.getRequest('/posts', rebuildList, handleError);
};
loadData();