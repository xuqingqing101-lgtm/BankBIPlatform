# Test Data for AI Board

This directory contains generated test CSV files designed to demonstrate the capabilities of the AI Board platform. 
These datasets are aligned with the dashboard charts and suggested questions in the chat interface.

## Files Description

1.  **financial_summary.csv**
    *   **Content**: Monthly financial metrics (Total Assets, Deposits, Loans, NPL Ratio, CAR, etc.).
    *   **Usage**: Upload to `financial_summary` table.
    *   **Questions**: "Analyze deposit trends", "Show capital adequacy ratio history".

2.  **loan_portfolio.csv**
    *   **Content**: Detailed loan records including corporate, retail, mortgage, and consumer loans with status.
    *   **Usage**: Upload to `loan_portfolio` table.
    *   **Questions**: "What is the NPL ratio?", "List customers with loans overdue > 90 days".

3.  **customer_risk.csv**
    *   **Content**: Customer profiles with risk ratings, total assets, and credit scores.
    *   **Usage**: Upload to `customer_risk` table.
    *   **Questions**: "List customers with assets > 5M and Low risk", "Show high-risk corporate customers".

4.  **corporate_credit.csv**
    *   **Content**: Credit limits and usage details for corporate clients.
    *   **Usage**: Upload to `corporate_credit` table.
    *   **Questions**: "Check credit usage for Alpha Tech Corp".

5.  **compliance_events.csv**
    *   **Content**: Log of AML alerts and compliance events.
    *   **Usage**: Upload to `compliance_events` table.
    *   **Questions**: "Any suspicious large transactions?", "Generate compliance report".

## How to Use

1.  Go to the **Data Management** (数据管理) section in the application.
2.  Upload each file.
3.  The system will automatically create the tables.
4.  Go to the **Chat Interface** (智能问数) and ask questions related to the data.
