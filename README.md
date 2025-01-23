# ft_transcendence

## Overview

Welcome to the ft_transcendence project! This project is a comprehensive web application designed to host a multiplayer Pong game with various advanced features. The goal is to create a robust, secure, and engaging platform where users can play Pong against each other, participate in tournaments, and enjoy a variety of customization options.

## Table of Contents

1. [Project Description](#project-description)
2. [Features](#features)
3. [Modules](#modules)
4. [Installation](#installation)
5. [Usage](#usage)

## Project Description

ft_transcendence is a web application that allows users to play the classic Pong game against other players in real-time. The project includes various modules that enhance the gameplay experience, provide user management and authentication, ensure security, and offer customization options. The application is built using modern web technologies and follows best practices for security and performance.

## Features

- Real-time multiplayer Pong game
- User registration and authentication
- Tournament management and matchmaking
- AI opponent
- Game customization options
- User and game stats dashboards
- Two-Factor Authentication (2FA) and JWT
- Backend designed as microservices
- Blockchain integration for storing tournament scores
- real time login status of your registered friends

## Modules

### Major Modules

1. **Use a Framework as Backend**: Utilizes Django for backend development.
2. **Store the Score of a Tournament in the Blockchain**: Uses Ethereum and Solidity for secure score storage.
3. **Standard User Management, Authentication, Users Across Tournaments**: Manages user registration, login, and profiles.
4. **Implementing a Remote Authentication**: Integrates OAuth 2.0 authentication.
5. **Multiple Players**: Supports more than two players in a game.
6. **Introduce an AI Opponent**: Adds an AI player to the game.
7. **Implement Two-Factor Authentication (2FA) and JWT**: Enhances security with 2FA and JWT.
8. **Designing the Backend as Microservices**: Architected using a microservices approach.

### Minor Modules

1. **Use a Front-End Framework or Toolkit**: Utilizes Bootstrap for frontend development.
2. **Use a Database for the Backend**: Uses PostgreSQL for database management.
3. **Game Customization Options**: Provides various customization features for the game.
4. **User and Game Stats Dashboards**: Displays user and game statistics.
5. **Expanding Browser Compatibility**: Adds support for additional web browsers.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ft_transcendence.git
   cd ft_transcendence
   ```

2. Set up the environment variables:
   ```bash
   cp .env.example .env
   ```

3. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
   or with Makefile
   ```bash
     make up
   ```

5. Access the application at `http://localhost:3000`.

## Usage

Once the application is running, you can:

- Register a new user account.
- Log in with your credentials.
- Join or create a Pong game.
- Participate in tournaments.
- Customize your game settings.
- View your game statistics and history.


Thank you for checking out the ft_transcendence project! We hope you enjoy playing Pong and exploring the various features we've implemented. If you have any questions or feedback, feel free to open an issue or reach out to us. Happy gaming!
