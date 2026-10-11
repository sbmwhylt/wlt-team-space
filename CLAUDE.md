# CLAUDE.md

This document provides guidance for Claude Code when working in this repository.

# Project Overview

This is a full-stack system for the Why Leave Town team. It handles user management and other team management features, and it will continue to grow with additional internal tools.

The project is built as a monolithic core application with support for smaller micro-apps and microservices.

# Current structure:

Additional apps (such as the Next.js microsites manager) are connected to the main backend but live as smaller, independent projects.

The goal is to keep one central system while allowing smaller apps to plug into it when needed.

# Development Guidelines

- Always read the full instruction before making changes.
- If a request is unclear, ask for clarification instead of guessing.
- If a change requires database updates, warn first and wait for confirmation before proceeding.
- Follow the existing file structure and coding patterns.
- Keep the codebase simple, consistent, and easy to maintain.
- Avoid over-engineering solutions.