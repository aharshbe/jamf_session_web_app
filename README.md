# JAMF Session 🦃
## Purpose
* Internal tool which allows GitHub employees to view JAMF and Gear data in one place. It was specifically made for IT and SecOps teams.

* Allows the user to:
	* View various JAMF data, i.e., Scripts, Policies, Computer Groups, Users, Computers, Extension Attributes, etc.
	* View various Gear data, i.e., Computers owned by an employee
	* Compare the two, e.g., locate computers not in JAMF but in Gear
	* Send automated emails to employees to help with remediation of endpoints not in JAMF for better security
	* Identify any unknown computer by serial number providing details such as which employee the computer belongs to
	* Identify any sepcific GitHub employees registered computer's in Gear and if they are in JAMF
	* View any endpoint's details such as which certificates are installed and which JAMF smart groups it belongs to, to name a few

### Dependencies:
* JavaScript installed
* Node.js installed
* React installed
* An active internet connection
* npm install:
	* request package
	* express
	* dotenv
	* request_promise
	* cors (testing only)
	* nodemailer
* Must have the correct `.env` file with proper credentials installed in  `jamf_session_gh/jamf_gear_app` and `jamf_session_gh/jamf_gear_app/client` respectively
* Must be a GitHub employee
* Must know the server's password to access data

** To install all dependencies (apart from credentials) run `npm install` in `jamf_session_gh/jamf_gear_app` and `yarn install` in `jamf_session_gh/jamf_gear_app/client`

### Usage:
* Clone repo, e.g., `git clone Repo_URL`
* open your terminal and `cd` into the cloned repo
* Request .env credentials from repo admins (see below)
* Request server username and password from repo admins (see below)
* type `node app.js` to start the server (node) in `jamf_session_gh/jamf_gear_app`
* Open internet browser to: `http://localhost:3000/routes_info` to see server webhooks
* type `yarn start` to run client (react) in `jamf_session_gh/jamf_gear_app/client`
* Open internet browser to: `http://localhost:3001` to see the app running

#### Authors:
* [Austin Harshberger](https://github.com/aharshbe) => Node.js (server side)
* [Travis Kopp](https://github.com/teakopp) => React (client side)
