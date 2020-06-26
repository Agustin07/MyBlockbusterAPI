# My Blockbuster API

## Modules

**Movies Module :** 
- Handle crud operations for movies (create modify, delete, serach one or all )
- Handle add or delete a tag for one movie. Only admin can do this task.
- Handle the rent, return or buy of a movie. User can do this for its own.

**Auth Module :** 
- Handle login authentication and the authorization using JWT token. Also Handle roles permission.

**Users Module :** 
- Handle crud operations for users (create modify, delete, serach one or all ).


### Requirements:

| | VERSION |
|----------------|---------------|
|Node| ^12.16.3 |
|Typescript | ^3.7.4 |
|Nestjs | ^7.0.0 |
|@nestjs/config| ^0.5.0|
|psql (PostgreSQL)| ^9.4.4|

## Creating the database
Run the .sql file, it will create the database called: **"blockbuster_testdb"**

```
\i dbtest_script.sql
```

>*important: an Admin user will be created! test login with it!*
>```
> {
>   "email": "admin@admin.com",
>   "password": "admin"
> }
>```

## Endpoints description

| **Endpoint** | **Description** |**AuthKey**|**Role**|
|--|--|--|--|
| POST `/login` | Authenticate user and retrieve an auth  key | No required ||
| POST `/users` | Create user account | No required ||
| GET `/users` | Get all users registered | Required ||
| GET `/users/:id` | Get user by id | Required ||
| PUT `/users/:id` | Modify user information by id | required | CLIENT|
| DELETE `/users/:id` | Delete user by id | Required |CLIENT|
| POST `/movies` | Save a movie | Required |ADMIN|
|GET `/movies`| Retrieve all the movies availables (sorted alphabetically) |Required||
| GET `/movies/:id` | Get movie by id | No required ||
| PUT `/movies/:id` | Modify movie information by id | Required | ADMIN|
| DELETE `/movies/:id` | Delete movie by id | Required |ADMIN|
| POST `/movies/:id/tag` | Add a Tag to a movie by id  | Required | ADMIN|
| DELETE `/movies/:id/tag` | Delete a Tag if exist in movie by id | Required |ADMIN|
|POST `/movies/:id/rent`| Rent a movie by id |Required| CLIENT|
|POST `/movies/:id/return`| Return a movie by id|Required|CLIENT|
|POST `/movies/:id/buy`| Buy a movie by id|Required|CLIENT|

Try to login using admin account created by default in the DBscript! 

Check test examples on our postman official collection!
![My blockbuster collection on Postman!](https://i.ibb.co/K6Vzs5j/blockusterrrr.png)


## Postman tests' documentation

**You can check endpoints' tests here:**

-  [My blockbuster webpage examples on Postman](https://documenter.getpostman.com/view/11476851/T17AhqDr?version=latest)

-  [Postman collection link](https://www.getpostman.com/collections/3bd2f8fdbd4bfe699db5)


## Test examples

```javascript
`#rental.service.ts`

	rentOrSellMovie(movie: Movie){
		if(movie.stock===0) throw  new  NotFoundException('Sorry, sold out.');
		if(movie.availability===false) throw  new  NotFoundException('Sorry, not available.');
		movie.stock--;
		if(movie.stock===0) movie.availability = false;
		return  movie;
	}

	returnMovie(movie: Movie){
		movie.stock++;
		if(movie.availability===false) movie.availability = true;
		return  movie;
	}

`#mocks/movies.mocks.ts`

	export  const  movie1 : Movie = {
		id:  1,
		title:  "Finding Nemo",
		description:  "Marlyn is a fish and is looking for Nemo",
		poster:  "https://i.ibb.co/k8Dkx86/descarga-2.jpg",
		stock:  5,
		trailer:"https://www.youtube.com/watch?v=9oQ628Seb9w",
		price:  5.99,
		availability:  true,
	};

  
	export  const  movie2 : Movie = {
		id:  2,
		title:  "Finding Dory",
		description:  "Now Marlyn and Nemo are looking for Dory",
		poster:  "https://i.ibb.co/Kyp82Br/descarga-3.jpg",
		stock:  1,
		trailer:"https://www.youtube.com/watch?v=JhvrQeY3doI",
		price:  6.99,
		availability:  true,
	};

 
	export  const  movie3 : Movie = {
		id:  3,
		title:  "21 Jump Street",
		description:  "The best police officers of their home",
		poster:  "https://i.ibb.co/Nst027S/descarga.jpg",
		stock:  2,
		trailer:"https://www.youtube.com/watch?v=RLoKtb4c4W0",
		price:  5.99,
		availability:  false,
	};
		
`#rental.service.spec.ts`

describe('rentOrSellMovie',()=>{
	it('should return a movie with stock: 4', () => {
		let  res = service.rentOrSellMovie(movie1);
		expect(res.stock).toEqual(4);
		expect(res.availability).toEqual(true);
	});

	it('should return a movie with stock: 0, availability: false ', () => {
		let  res = service.rentOrSellMovie(movie2);
		expect(res.stock).toEqual(0);
		expect(res.availability).toEqual(false);
	});

	it('should throw on stock 0 ', () => {
		try {
			service.rentOrSellMovie(movie2);
		} catch (error) {
			expect(error).toBeInstanceOf(NotFoundException);
		}
	});

	it('should throw on not available movie ', () => {
		try {
			service.rentOrSellMovie(movie3);
		} catch (error) {
			expect(error).toBeInstanceOf(NotFoundException);
		}
	});
});

```

## Coverage with jest

![Jest coverage!](https://i.ibb.co/ZYHCkVQ/coverage.png)




