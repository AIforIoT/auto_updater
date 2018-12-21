const installCore = require('./core/install');

printOptions=(ok)=>{
    if(!ok) console.log(`   You specified a wrong command.`);
    console.log(`
    This CLI have the following options:
        fetch               :   Will look for new module versions and report if any.
        install-all         :   Will fetch for all modules that have a new versions and install them.
        install "module"    :   Will install the given module if needed.
        options             :   Will print this same list.
    `)
};

installRepo = (repo_obj) => {
    installCore(repo_obj).then( () => {
        console.log(`Repository '${repo_obj.repo.name}' has been updated (TODO)`);
    }).catch(err=>console.error(err));
};

let cmd = process.argv[2];

switch (cmd) {
    case 'fetch':
        require('./core/fetch')().then(repositories => {
            let len = repositories.length;
            while (len--) //Update to repos_config.json to add the latest git version avaliable ??
                console.log(`${len} - Repository '${repositories[len].repo.name}' ${repositories[len].need_update?'needs to be updated':'is up to date'}`);
        }).catch(err=>console.log(err));
        break;
    case 'install-all':
        require('./core/fetch')().then(repositories => {
            let len = repositories.length;
            while (len--) if (repositories[len].need_update) installRepo(repositories[len]);
        }).catch(err=>console.error(err));
        break;
    case 'install':
        require('./core/fetch')(process.argv[3]).then(repo =>{
            if(repo[0] && repo[0].need_update) installRepo(repo[0]);
            else if(repo[0]) console.log(`Repository ${repo[0].repo.name} is already up to date.`);
            else console.log(`That Repo just don't exist`);
        }).catch(err=>console.error(err));
        break;
    case 'options':
        printOptions(true);
        break;
    default:
        printOptions(false);
        break;
}
