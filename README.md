# techhub-v2

## install all required packages
`cd client && npm install --prefix client && cd ../server && composer update && copy .env.example .env && php artisan key:generate && php artisan db:create && php artisan migrate:fresh --seed`

## run both server and client on different consoles
`cd client && npm start`


`cd server && php artisan serve`