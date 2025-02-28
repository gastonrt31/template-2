## Description
Build a simple system that allows the creation of users, each assigned a unique QR code containing their data. The system must display all users in a table. Additionally, each user should have 3 stages where they are required to scan their unique QR code using the device camera. Once a QR code is successfully scanned for a stage, that stage should be marked as "CHECK" and the system must record the time of the scan.

## Technology Stack
- **Frontend:** Next.js
- **Backend & Database:** Supabase
- **UI Components & Styling:** shadcn

## Requirements

### User Creation
- **Input Data:** 
  - Name
  - License Plate
  - Identity Card Number
- **QR Code Generation:**
  - Generate a unique QR code for each user embedding the above data.
- **Display:**
  - After creating a user, display the user in a table showing all user details along with their unique QR code.

### User Table
- **Columns:**
  - User Name
  - License Plate
  - Identity Card Number
  - QR Code (as an image)
  - Stage 1 Status (with a "Scan" button)
  - Stage 1 Scan Time
  - Stage 2 Status (with a "Scan" button)
  - Stage 2 Scan Time
  - Stage 3 Status (with a "Scan" button)
  - Stage 3 Scan Time
- **Functionality:**
  - The table should be updated in real time as users complete each stage.

### QR Code Scanning & Stage Check-In
- **Stages:**
  - Each user has 3 stages to complete.
- **Scan Process:**
  - For each stage, include a button that opens the device camera to scan the user's unique QR code.
  - Upon successful scan:
    - Validate that the scanned QR matches the user’s QR data.
    - Mark the corresponding stage as "CHECK".
    - Record the timestamp of the scan.
- **Error Handling:**
  - If the QR code does not match, show an error message and do not mark the stage.

### Additional Details
- **Framework / Stack:** 
  - Use **Next.js** for building the front-end.
  - Use **Supabase** for backend services, data storage, and authentication.
  - Use **shadcn** for UI components and styling to ensure a clean and modern interface.
- **Design Considerations:**
  - The user interface should be clean and simple.
  - Ensure proper validations on user input and scan verification.
  - Provide real-time updates on the user table as stages are completed.

## Expected Outcome
The final system should allow an admin or user to:
1. Create new users with their respective details.
2. Automatically generate and display a unique QR code per user.
3. View a table with all registered users.
4. For each user, perform a QR scan per stage using a button that triggers the camera.
5. Mark each stage as completed ("CHECK") when the QR code is correctly scanned, along with the timestamp of the scan.

Please implement this system in a modular and maintainable way, ensuring clear separation of concerns, proper error handling, and efficient integration of the specified technologies.
