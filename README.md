## Instructions about how to run Unites Converters Application :

 *** Steps to run the application ***

- Make sure that Nodejs is installed in your computer 

- Make sure Nodejs version is : v18.13.0
     * run the following  command in your terminal : node -v 

- Make sure that the npm version is : 8.19.3
    * run the following command in your terminal : npm -v 

- Make sure that your computer  has 'git' 
   * run the following command in your terminal : git -v 

- The 'main' brach is the official branch for this project 

- Clone the repository 'FlexionAssessmentSolution' to your local machine 
    * run the following command in your terminal :
      - for https run : 
       git clone  https://github.com/hillal20/FlexionAssessmentSolution.git  
      - for SSH  run :
       git clone git@github.com:hillal20/FlexionAssessmentSolution.git

- Once nodejs and npm are good-to-go , cd to the root folder (where you could see the src folder and the package.json )

- Run the following command in your terminal :
    npm install 

- After the installation is finished,  start the app by running  the command : 
    npm run dev 

- open the browser and and navigate to :  
      http://localhost:5173/

- To test the application run the command :
    npm test 

- To build the application run the command :
   npm run build 
   
the 'dist' folder will be generated;  it is the folder which  will be deployed into Digital Ocean cloud 

- To see the testing coverage run the command :
   npm  run coverage 
- To see if the test coverage is passed the testing-thresholds run the command :
   npm  run check-coverage

- To see the CICD pipeline instructions open the .github  folder, then open  the 
  workflows folder, then read the node.js.yml file
   - there are 4 jobs running in the CICD:
        
        pre_build , build , deploy , post_deploy 


-  To observe the CICD  running just click on : Actions tab in the  github page (repo):
   hillal20/FlexionAssessmentSolution 
    
- the URL for the app deployed in Digital Ocean is :

 https://unites-converter-j6bhi.ondigitalocean.app/
      

 *** Prioritized development tasks to improve my solution  ***

 1 - Improve my code  to handle edge cases and unexpected inputs.

 2 - Add test cases to verify the correctness of the algorithm and the handling   of edge cases.

 3 - Refactor the code to improve readability,  maintainability and reusability .

 4 - Add more input validations to ensure that the values  passed are valid 

 5 - Solid error handling function to over all the edges 

 6 - Use comments to explain the difficult parts of the code  
 
 7 - Make the code  generic enough to accept scalability 

 8 - Improve the space and time complexity  to make the application light and fast 

 9 - Make the application user-friendly by providing the UI part of it ,  if there is none 

