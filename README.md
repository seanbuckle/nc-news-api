# Northcoders News API
This project is a demonstration of my database skills from the Northcoders bootcamp. It's an API that lets you get news articles, comment on them, vote up or down.

# Take a look

Feel free to clone this repo and take a look at what's going on behind the scenes. I also have it hosted over at [NC News API](https://nc-news-de5p.onrender.com/api) so you can see it live.

## Setup

### Postgres

The database for this project was built with postgres, and uses it to test. If you don't already have it, install [postgres](http://postgresguide.com/setup/install.html) and [set up a new user](http://postgresguide.com/setup/users.html)

### Node.js & Node Package Manager

This project was built using node.js v22.11.0 and npm v10.5.1. If you don't already have them, you can find instructions to install them both here: [Installing node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Git CLI

To clone the repo onto your computer, you're also going to need a local version of git. See the [git documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Clone the repo

Once you've got the pre-setup setup, it's time to clone the repo. In the command line, navigate to the folder you want to work from, and then run the following line:

```bash
git clone https://github.com/seanbuckle/nc-news.git

cd nc-news
```

Now you can open the folder in a code editor. I built this in [VSCode](https://code.visualstudio.com/download).

### Dependencies
The main dependencies you're going to need are:
* dotenv - handles the data environment variables
* Express - runs the server
* pg - handles the database setup
* pg-format - handles the SQL queries
```bash
npm i dotenv express pg pg-format
```
**\*\*\* TESTING ONLY \*\*\***

The other dependencies are for testing:
* husky - checks tests before commits
* jest - the testing suite
* jest-extended - extends functionality of jest
* jest-sorted - adds sorting features to jest
* supertest - used for integration testing
```bash
npm i
```
### Environment variables
Create two file `.env.development` and `.env.test`

`.env.development`

```
PGDATABASE=[DATABASE_NAME]
```
`.env.test`
```
PGDATABASE=[DATABASE_NAME]_test
```
