# techhub-v2

## install all required packages
### copy and paste the entire codeblock into a terminal on the root directory
```
cd client
copy sample.env .env
npm install --force
cd ../server
composer update
copy .env.example .env
php artisan key:generate
php artisan db:create
php artisan migrate:fresh --seed
```

### incase php artisan db:create fail, manually create database matching the DB_DATABASE in the .env file

## run both server and client on different consoles
`cd client && npm start`


`cd server && php artisan serve`
