# Action to replace placeholder variables inside .env files

### Context 
The replacement of placeholder variables within .env files with secrets from the repository is a - in my case - often occurring scenario. In a GitHub action, it is not possible to use {{ secrets.XXX }} inside .env-files. Therefore it's required to use scripts inside the workflow to handle that. This approach is pretty redundant and not generalized.
This action aims to tackle that problem.


### Future plans
Besides the use of .env-files, it might be possible to extend this action to replace any variables in any file. This way, all sensitive informations can be stored in secrets and passed as env variables to the GitHub action workflow
