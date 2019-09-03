import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/Issues';
import Issues from './models/Issues';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect( 'mongodb://127.0.0.1:27017/issues', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open',() => {
    console.log('MongoDB database connection established successfully');
});


//retrieving issues
router.route('/issues').get((req,res) => {
    Issue.find((err, issues) =>{
        if(err)
         console.log(err);
        else
         res.json(issues);
    });

});

router.route('issues/:id').get((req,res) =>{
    Issue.findById(req.param.id, (err, issue) =>{
        if(err)
          console,log(err);
        else
         res.json(issue);
    });
});

//adding issues
router.route('/issues/add').post((req,res) =>{
    let issue = new Issue(req.body);
    issue.save()
    .then(issue => {
        res.status(200).json({'issue':'added successfully'});
    })
    .catch(err => {
        res.status(400).send('failed to create new record');
    });
});

//update issue
router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load Document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

//deleting issues
router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});


app.use('/', router);
app.listen(4000,() => console.log(`Express server running on port 4000`));