const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db.select('*').from('accounts')
    .then(accounts=>{
        res.status(200).json(accounts);
    })
    .catch(err =>{
        res.json(err);
    })
    
});
// server.get('/?limit=3', (req, res)=> {
//     db.select('*').from('accounts')
//     .then(accounts=>{
//         res.status(200).json(accounts);
//     })
//     .catch(err =>{
//         res.json(err);
//     })
    

// })
server.get('/:id', (req,res)=>{
    const { id } = req.params;
    db('accounts').where({id}).first()
    .then(account => {
        res.status(200).json(account)
    })
    .catch(err => {
        res.json(err);
    })
})
server.post('/', (req, res)=> {
    const {name, budget} = req.body;
    if(! name || !budget){
        res.status(400).json({message: "please provide name and budget"})
    } else {
        db('accounts').insert(req.body, 'id')
        .then(([id])=> {
            db('accounts')
            .where({id})
            .first()
            .then(account => {
                res.status(200).json(account)
            })

        })
        .catch(err => {
            res.json(err)
        })
    }
});
server.put('/:id', (req, res)=>{
    const changes = req.body;
    db('accounts').where('id', req.params.id).update(changes)
    .then(count => {
        res.status(200).json({message: `updated ${count} account`})
    })
    .catch(err => {
        res.json(err);
    })
})
server.delete('/:id', (req, res)=> {
    db('accounts').where({id : req.params.id}).del()
    .then(count => {
        res.status(200).json({message: `deleted ${count} account`})
    })
    .catch(err => {
        res.json(err);
    })
})


module.exports = server;