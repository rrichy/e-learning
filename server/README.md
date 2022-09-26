# Running the application locally

### Install the libraries
`composer update`

### Create the .env from .env.example
`cp .env.example .env`

### Generate app key
`php artisan key:generate`

### Create table if it does not exists
`php artisan db:create`  

### Migrate and seed the database
`php artisan migrate:fresh --seed`

### Make sure FRONTEND_URL matches the Front-end .env's
`http://VITE_HOST:VITE_PORT`

### Run the application. 
`php artisan serve`

