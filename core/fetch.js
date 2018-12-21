const octokit = require('@octokit/rest')();
let reposConfig = require('./repos_config');

module.exports = async (repo_name) => {
    let responses = [];
    const all = !repo_name || repo_name === undefined || repo_name === 'undefinded';
    for(let repo of reposConfig.repos){
        if (all) {
            const r = await isLastTag(repo, reposConfig.owner);
            if(r.isBigger) responses.push(Promise.resolve({repo:repo, need_update:true, links: r.links}));
            else responses.push(Promise.resolve({repo:repo, need_update:false, links: r.links}));
        }else if(repo_name === repo.name){
            const r = await isLastTag(repo, reposConfig.owner);
            if(r.isBigger) responses.push(Promise.resolve({repo:repo, need_update:true, links: r.links}));
            else responses.push(Promise.resolve({repo:repo, need_update:false, links: r.links}));
        }
    }
    return Promise.all(responses);
};

async function isLastTag(repo, owner) {
    const response = await octokit.repos.getTags({owner:owner, repo:repo.name, per_page:1});
    if (response.data && response.data[0]){
        repo.last_git_tag = response.data[0].name;
        saveConfig();
        return Promise.resolve({isBigger:isBigger(response.data[0].name, repo['last_tag']), links:response.data[0]})
    }else return Promise.resolve({isBigger:false, links:null})
}

function saveConfig(){
    const fs = require('fs');
    let data = JSON.stringify(reposConfig);
    fs.writeFileSync('core/repos_config.json',data)
}

function isBigger(a, b) {
    let a2 = a.split('.');
    let b2 = b.split('.');

    return (a2[0]>b2[0]
        || (a2[0]===b2[0] && a2[1] && b2[1] && a2[1]>b2[1])
        || (a2[0]===b2[0] && a2[1] && b2[1] && a2[1]===b2[1] && a2[2] && b2[2] && a2[2]>b2[2]));
}