# Abiball

## Ticket Management System for our Prom

This is a Proof-of-Concept for a ticket management system for our prom. It is not intended to be used in production.

### Frontend

- Remix as Fullstack Framework
- React as Frontend Library
- TailwindCSS as CSS Framework

### Authentication

- Session-based authentication using remix-auth

### Database

- User and Ticket Data is stored in a PostgreSQL Database on supabase
- Data is modeled using Prisma

### Ticket Generation

- Tickets are generated using jsPDF
- Aztec codes are generated using bwip-js with a custom jwt implementation as payload
- Payload is compressed via MessagePack
- Signing is done using HS256

### Email

- Emails are sent using sendinblue

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
