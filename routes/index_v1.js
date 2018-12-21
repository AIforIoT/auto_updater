const express = require('express');
const router = express.Router();
const fetchCore = require('../core/fetch');
const installCore = require('../core/install');

function getRepos(req, res, next) {
    try{
        let reposConfig = require('../core/repos_config');
        res.status(200).send(reposConfig);
    }catch {
        next();
    }
}

function fetch(req, res, next) {
    const repo_name = req.params.name?req.params.name:undefined;
    fetchCore(repo_name).then(repositories=>{
        res.status(200).send(repositories);
    }).catch(err=>next(err));
}

function install(req, res, next) {
    const repo_name = req.params.name?req.params.name:undefined;
    fetchCore(repo_name).then(repositories=>{
        let len = repositories.length;
        while (len--) if (repositories[len].need_update) installRepo(repositories[len]).then(/*Update Doc?*/).catch(/*Show error on the UI?*/);
        res.status(200).send();
    }).catch(err=>next(err));
}

async function installRepo(repo_obj) { //async to make it fast for UX
    installCore(repo_obj).then( () => {
        console.log(`Repository '${repo_obj.repo.name}' has been updated (TODO)`);
        return Promise.resolve();
    }).catch(err=>{
        console.error(err);
        return Promise.reject()
    });
}

/* GET home page. Default */
router.get('/', function(req, res/*, next*/) {
    res.status(200).send("Active!");
});

router.get('/repos', getRepos);
router.get('/fetch', fetch);
router.get('/install/all', install);
router.get('/install/:name', install);

module.exports = router;
