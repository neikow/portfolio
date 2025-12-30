# Portfolio

Personal portfolio website created using Nuxt.js to showcase my projects, skills, and experience.

## Tech Stack

- **Framework**: `nuxt>=4`
- **Language**: `typescript`
- **Styling**: `tailwindcss` + `nuxt-ui`
- **Database**: `postgresql`
- **ORM**: `drizzle-orm`
- **Deployment**: `docker`
- **Version Control**: `git` + `github`

## Development

To run the project locally, follow these steps:

1. Clone the repository and navigate to the project directory:
    ```bash
    git clone https://github.com/neikow/porfolio.git porfolio && cd porfolio
    ```

2. Install the dependencies:
    ```bash
    yarn install
    ```

3. Create a `.env` file in the root directory and add any necessary environment variables.
    ```env
    cp .env.example .env
    ```

4. Run the development database
    ```bash
    docker compose -f docker-compose.dev.yml up -d
    ```

5. Apply database migrations:
    ```bash
    yarn run db:migrate
    ```

6. Start the development server:
    ```bash
    yarn dev
    ```

7. Profit!

## Deployment

The project is configured for deployment on my personal server using Docker.

## License

The code is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more information.