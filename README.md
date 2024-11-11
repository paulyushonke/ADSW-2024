# ADSW-2024

Welcome to the **ADSW-2024** repository! This project is a comprehensive implementation of various design patterns for the discipline "Architecture and Design Software (Part 1)" using the T3 Stack.

## Project Overview

This project focuses on web-based solutions to practical problems using design patterns such as Memento and Factory Method. It is built using the T3 Stack, which combines such modern technologies to create scalable and efficient applications:
- **Next.js**: Server-side rendering and static site generation.
- **Drizzle**: Database ORM.
- **Tailwind CSS**: Styling framework.
- **Shadcn**: A modern UI component library to enhance the user experience.
- **Neon**: A cutting-edge serverless PostgreSQL solution for high-performance database access.

## Lab Work Pages

This application includes lab work pages that demonstrate the following concepts:

1. **Lab 2: Implementing the Memento Pattern**
   - Demonstrates state management and undo/redo functionality.
   - Allows customization of an employee table UI.
   - Key Features:
     - Save and restore UI states using Memento.
     - Supports settings for table styles like font and colors.
   - **Objective**: Practical application of Memento and Command patterns for state management.

2. **Lab 3: Implementing the Factory Method Pattern**
   - Handles data persistence and supports saving employee data in different formats:
     - `.txt` for plain text,
     - `.xml` for structured data,
     - `.json` for web applications.
   - **Objective**: Demonstrate Factory Method for flexible file generation.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paulyushonke/ADSW-2024.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ADSW-2024
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables by renaming `.env.example` to `.env` and filling required details.
5. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Undo/Redo Operations** using Memento Pattern.
- **Export Options**:
  - TXT, XML, JSON using Factory Method.
- **Dynamic UI Customization**:
  - Modify employee tables visually.
  
