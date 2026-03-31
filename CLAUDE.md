# CLAUDE.md

This document provides guidance for Claude Code when working in this repository.

# Project Overview

This is a full-stack system for the Why Leave Town team. It handles user management and other team management features, and it will continue to grow with additional internal tools.

The project is built as a monolithic core application with support for smaller micro-apps and microservices.

# Current structure:

client/ → main frontend application
server/ → backend services and API
Additional apps (such as the Next.js microsites manager) are connected to the main backend but live as smaller, independent projects.

The goal is to keep one central system while allowing smaller apps to plug into it when needed.

# Tech Stack

Frontend
- React
- JavaScript / TypeScript
- Tailwind CSS
- shadcn/ui (Tailwind component library)

Backend
- Node Express

Database
- PostgreSQL (Sequelize)

General
- Package manager: npm

# Development Guidelines

- Always read the full instruction before making changes.
- If a request is unclear, ask for clarification instead of guessing.
- If a change requires database updates, warn first and wait for confirmation before proceeding.
- Follow the existing file structure and coding patterns.
- Keep the codebase simple, consistent, and easy to maintain.
- Avoid over-engineering solutions.

# Code Style Expectations
- Prefer simple and readable code over complex logic.
- Match the formatting and structure already used in the project.
- Keep functions small and focused.
- Avoid unnecessary abstractions unless they clearly improve maintainability.

# What to Avoid
- Long explanations that do not help solve the problem
- Unnecessary refactoring unrelated to the task
- Adding new patterns that conflict with the current codebase
- Overcomplicated solutions when a simple one works