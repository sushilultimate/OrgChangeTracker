This simple SFDX plugin can be used for tracking org changes. When you run command, it displays list of changes done in org in last N days. Where N can be passed as parameter

sample command  - sfdx audit:org -u ORG_USER_NAME --howmany 3


Plugin installation instructions

Download the orgChangesTracker-0.0.0.vsix from repository and open terminal window in vscode or separately. Run below command(make sure the vsix file is in the same directory)

code --install-extension orgChangesTracker-0.0.0.vsix
