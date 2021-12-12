# Financepeer_JsonFileBased_Application
<br />
A basic web application has the following features: 
1. An authentication system. 
2. Upload a JSON file and save the data in the database. 
3. Display the data saved in the database.
<br />

# Technologies Used
1.FrontEnd => React.js (client folder)
<br />
2.BackEnd => Node.js
<br />
3.Database => MYSQL

# Project and Database setup
1. Download/ Clone main project files to local Devic

2. Launch MYSQL workbench and create database `financepeer_jsondata`

3. Create tables `jdata` and `users`

4. All Creation related quires are provided in directory `Financepeer_JsonFileBased_Application/database_details`
=> Text file `Database creation queries` contains the creation queries
=> Sql files `financepeer_jsondata_jdata` and `financepeer_jsondata_users` can be used to directly import into MYSQL usinf Import Data option

5.go to `Financepeer_JsonFileBased_Application/server` file -->please provide database connection details (host,user,password,database).
In code=> const mydb = mysql.createConnection({
					  user: "",
					  host: "",
					  password: "",
					  database: "financepeer_jsondata"
					})
 


# Backend setup and Front end setup
1.Open project in VSCODE and open terminal

2.Current directory in termail would be `Financepeer_JsonFileBased_Application/`
run command `npm install` or `npm install --force` in case of dependencies conflict

3.Then run Command `cd client` to move into client folder

4.Now directly in termail would be `Financepeer_JsonFileBased_Application\client`
=> run command `npm install` or `npm install --force` in case of dependencies conflict

5. Then run Command `cd ..` to move to root directory

6. Now in root directory run ` npm run dev`.This will run both front-end and server concurrently.
=> application would run at http://localhost:3000
