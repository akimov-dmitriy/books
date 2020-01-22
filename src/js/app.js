import Slider from "./Slider";
import {getBooksFromLocalStorage, saveBooks, deleteBook, findBookById} from "./common";
import {BOOKS_URL,NO_IMG_URL} from "./constants";

let books = [];

/**
 *
 * @returns {Promise<{publishing_house: (*|string), address: string, data: *, phone: (Document.phone|string|string|*),
 * author: string, theme: string | string[] | string, id: *, photos: *, name_book: *}[] | never>}
 */
const getBooksFromServer = (url) => {
    return fetch(url)
        .then(res => res.json())
        .then(res => res.items.map(elem => {
            return {
                id: elem.id,
                theme: elem.volumeInfo.categories || 'не указана',
                phone: elem.volumeInfo.phone || 'не указан',
                address: elem.volumeInfo.address || 'не указан',
                publishing_house: elem.volumeInfo.publisher || 'не указано',
                data: elem.volumeInfo.publishedDate || 'не указана',
                author: elem.volumeInfo.authors ? elem.volumeInfo.authors.join(', ') : 'не указан',
                photos: elem.volumeInfo.imageLinks ? [`${elem.volumeInfo.imageLinks.thumbnail}`]
                    : [NO_IMG_URL],
                name_book: elem.volumeInfo.title,
            }
        }))
}

/**
 *
 * @param {{photos: string[]}} book
 * @returns {array} - of photos
 */
const getPhotos = (book) => {
    return book.photos.slice();
};
/**
 *
 * @param {event} e
 */
const handlerDeleteBook = (e) => {
    let id = e.target.getAttribute('data-id');
    deleteBook(id, books);
    renderBooksList(books);
}
/**
 *
 * @param {event} e
 */
const handlerChangeBook = (e) => {
    let id = e.target.getAttribute('data-id');
    location.href = `/form.html?id=${id}`;
}
/**
 *
 * @param {event} e
 */
const handlerViewPhoto = (e) =>{
    let id = e.target.getAttribute('data-id');
    let book = findBookById(id, books);
    new Slider(getPhotos(book));
    e.stopPropagation()
}
/**
 *
 * @param parentElem - place to render book
 * @param {object} book - book for render
 */
const renderBook = (parentElem, book) => {
    let node = document.createElement('div');
    node.classList.add('book_block');
    node.innerHTML = `
      <div class = "book_left-section">
            <div class = "book_photo_wrap">
             </div>
      </div>
      <div class="book_info"  >
                <p><span class = "bold">Название книги:</span> 
                    <span class="cursive grey">"${book.name_book}"</span>
                </p>
                <p><span class = "bold">Рубрика:</span> ${book.theme}</p>
                <p><span class = "cursive">Автор(ы): ${book.author}</span></p>
                <p><span class = "bold">Издательство:</span> ${book.publishing_house}</p>
                <p><span class = "bold">Адрес издательства:</span> ${book.address}</p>
                <p><span class = "bold">Телефон издательства:</span> ${book.phone}</p>
                <p><span class = "bold">Дата издательства:</span> ${book.data}</p>
      </div>
    `;
    let deleteInput = document.createElement('input');
    deleteInput.classList.add('button-red','button','delete_book_btn');
    deleteInput.type = 'button';
    deleteInput.value = 'Удалить';
    deleteInput.onclick = handlerDeleteBook;
    deleteInput.dataset.id = book.id;

    let changeBookBtn = document.createElement('input');
    changeBookBtn.classList.add('button-green','button','change_book_btn');
    changeBookBtn.type = 'button';
    changeBookBtn.value = 'Редактировать';
    changeBookBtn.onclick = handlerChangeBook;
    changeBookBtn.dataset.id = book.id;

    let bookImg = document.createElement('img');
    bookImg.classList.add('book_img');
    bookImg.src = getPhotos(book)[0];
    bookImg.alt = 'book photo';
    bookImg.dataset.id = book.id;
    bookImg.onclick = handlerViewPhoto;

    let leftSection = node.querySelector('.book_left-section');
    leftSection.children[0].appendChild(bookImg);
    leftSection.appendChild(changeBookBtn);
    leftSection.appendChild(deleteInput);
    parentElem.appendChild(node);
}

/**
 *
 * @param {array} books - an array of  books
 */
const renderBooksList = (books) => {
    let booksListElem = document.querySelector('.books_list');
    booksListElem.innerHTML = '';
    books.forEach(elem => renderBook(booksListElem, elem))
};

/**
 *
 * @param {string} name - book name
 * @returns {*[]} - found books
 */
const findBooksByName = (name) => {
    return books.filter(book => book.name_book.toLowerCase().indexOf(name.toLowerCase()) !== -1);
}

if (!localStorage.getItem('books')) {
    getBooksFromServer(BOOKS_URL)
        .then(res => {
            renderBooksList(res);
            saveBooks(res);
            books = res;
        });
} else {
    books = getBooksFromLocalStorage();
    renderBooksList(books);
}

/**
 * books search event
 */
document.querySelector('.search_input').addEventListener('input', function () {
    let books = findBooksByName(this.value);
    renderBooksList(books);
});

document.querySelector('.add_book').addEventListener('click', function () {
    location.href = `/form.html`;
});

