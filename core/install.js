const fs = require('fs').promises;
const exec = require('child_process').exec;

module.exports = async (repo_obj) => {
    const git = require('simple-git')(repo_obj.path);
    git.pull((response)=>{
        if (response.indexOf('fatal')>-1) return Promise.reject(response);
        return fs.readdir(repo_obj.path).then(files=>{
            if(files.includes("updates.sh")){
                let update = exec(repo_obj.path+'/updates.sh', (error, stdout, stderr)=>{
                    if (error !== null) return Promise.reject(error);
                    else return Promise.resolve();
                });
            }else return Promise.resolve();
        });
    });
};
