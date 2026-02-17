const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true}));

const works = [
        { id: 1, 
          title: 'Massively Template',
          image: '/images/pic02.jpg',
          description: 'Одностраничный шаблон с дизайном.'
        }
    ]

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/portfolio', (req, res) => {
    res.render('portfolio', { works });
})

app.get('/work/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const work = works.find(w => w.id === id);

    if (work) {
        res.render('work', { work });
    }
    else {
        res.status(404).render('error')
    }
})

app.get('/add', (req, res) => {    
    res.render('add-work');
})

app.post('/add', (req, res) => {
    const { title, description, image } = req.body;
    const new_Work = {
        id: works.length + 1,
        title,
        description,
        image: image || '/images/pic04.jpg'
    };
    works.push(new_Work)
    console.log('Новая работа добавлена:', title, description, image);
    res.redirect('/portfolio');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body
    res.send(`Контактная форма отправлена!<br>Имя: ${name}<br>Email: ${email}<br>Сообщение: ${message}`)
})

app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const ind = works.findIndex(w => w.id === id);
    
    if (ind !== -1) {
        works.slice(ind, 1);
        console.log(`Проект удален! ${id}`);
    }
    res.redirect('/portfolio');
})

app.use((req, res) => {
    res.status(404).render('error');
})

app.listen(PORT, (err) => {
    if (err != undefined) {
        console.log(err);
    }
    else {
        console.log('Run success');
    }
})