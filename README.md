# Grocery Purchase Tracker

Welcome to the Grocery Purchase Tracker!

This app automates the process of recording your grocery expenses into a Google Sheet, simplifying your expense tracking by capturing receipt amounts and updating your Google Sheets effortlessly - **Just needs you take a photo of your receipts**!

## Features

- **Automated Expense Recording**: Automatically capture and record your grocery expenses.
- **Google Sheets Integration**: Seamlessly update your Google Sheets with your grocery purchase data.
- **Receipt Capture**: Easily capture receipt amounts for accurate expense tracking.
- **User-Friendly Interface**: Simple and intuitive design for ease of use.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Google account.
- You have created a Google Sheet for tracking your grocery expenses.
- You have installed the necessary software dependencies (listed below).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paco0161/grocery-purchase-tracker.git
2. Navigate to the project directory:
   ```bash
   cd grocery-purchase-tracker
3. Install the required dependencies:
   ```bash
   pnpm install
## Configuration

1. Set up Google Sheets API:
   - Follow the [Google Sheets API Quickstart Guide](https://developers.google.com/sheets/api/quickstart/nodejs) to enable the API and get your credentials.
   - Save your `credentials.json` file in the project directory.
   - Encode the whole credntials to base64 format and assign to env variable 'GOOGLE_SERVICE'

2. Configure the application:
   - Open the `.env.example` file, and clone it into `.env`.
   - Set your Google Sheets ID and other necessary configuration parameters.
