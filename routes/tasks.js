const express = require('express');
const router = express.Router();

//task model
const Task = require('../models/Task')
router.get('/',(req,res)=>{
   
    //@route GET /tasks
    //@desc GET ALL THE TASKS
    //@access PRIVATE

    Task.find()
    .then(data => {
        res.json(data)
    });

});

router.post('/', (req, res) =>{ 

    //@route POST /tasks
    //@desc POST TASKS
    //@access PRIVATE

    const newTask = Task({
        name: req.body.name
    });
    newTask.save()
    .then(task => {
        res.json(task)
    });
});

router.delete('/:id', (req,res) =>{

    //@route DELETE /tasks
    //@desc delete task
    //@access PRIVATE

    
    Task.findById(req.params.id)
    .then(task => {
        task.remove()
        .then(() => res.json({success:true}))
    })
    .catch(err => {
        res.status(404).json({success:false})
    })
})
module.exports = router;