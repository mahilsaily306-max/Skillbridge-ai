import { db } from './database';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  const existing = db.learningResources.findAll();
  if (existing.length > 0) return;

  const resources = [
    {
      id: '1', skill: 'JavaScript', description: 'JavaScript is a programming language for the web.',
      difficulty: 'beginner', estimatedHours: 40,
      officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      freeCourses: [{ title: 'JavaScript Basics', url: 'https://javascript.info/', platform: 'JavaScript.info' }, { title: 'FreeCodeCamp JS', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', platform: 'FreeCodeCamp' }],
      practicePlatforms: [{ name: 'LeetCode', url: 'https://leetcode.com/' }, { name: 'HackerRank', url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript' }],
      miniProjects: [{ title: 'To-Do App', description: 'Build a to-do list app with vanilla JS' }, { title: 'Calculator', description: 'Build a calculator with HTML/CSS/JS' }],
      videoTutorials: [{ title: 'JavaScript Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', platform: 'YouTube' }],
    },
    {
      id: '2', skill: 'TypeScript', description: 'TypeScript is a typed superset of JavaScript.',
      difficulty: 'intermediate', estimatedHours: 30,
      officialDocs: 'https://www.typescriptlang.org/docs/',
      freeCourses: [{ title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', platform: 'TypeScriptLang' }, { title: 'Total TypeScript', url: 'https://www.totaltypescript.com/tutorials', platform: 'Total TypeScript' }],
      practicePlatforms: [{ name: 'TypeScript Playground', url: 'https://www.typescriptlang.org/play' }],
      miniProjects: [{ title: 'TypeScript API', description: 'Build a REST API with TypeScript' }, { title: 'Typed React App', description: 'Convert a React app to TypeScript' }],
      videoTutorials: [{ title: 'TypeScript Tutorial', url: 'https://www.youtube.com/watch?v=30LWjhZzg50', platform: 'YouTube' }],
    },
    {
      id: '3', skill: 'React', description: 'React is a UI component library for web apps.',
      difficulty: 'intermediate', estimatedHours: 50,
      officialDocs: 'https://react.dev/',
      freeCourses: [{ title: 'React Tutorial', url: 'https://react.dev/learn', platform: 'React' }, { title: 'FreeCodeCamp React', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', platform: 'FreeCodeCamp' }],
      practicePlatforms: [{ name: 'CodeSandbox', url: 'https://codesandbox.io/' }],
      miniProjects: [{ title: 'Weather App', description: 'Build a weather app using React and OpenWeather API' }, { title: 'E-commerce Cart', description: 'Build a shopping cart with React Context' }],
      videoTutorials: [{ title: 'React Full Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', platform: 'YouTube' }],
    },
    {
      id: '4', skill: 'Node.js', description: 'Node.js is a JavaScript runtime for server-side programming.',
      difficulty: 'intermediate', estimatedHours: 40,
      officialDocs: 'https://nodejs.org/en/docs/',
      freeCourses: [{ title: 'Node.js Dev', url: 'https://nodejs.dev/en/learn/', platform: 'Node.js' }],
      practicePlatforms: [{ name: 'Exercism Node.js', url: 'https://exercism.org/tracks/javascript' }],
      miniProjects: [{ title: 'REST API', description: 'Build a CRUD REST API with Express' }, { title: 'Real-time Chat', description: 'Build a chat app with Socket.io' }],
      videoTutorials: [{ title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=zb3Qk8SG5Ms', platform: 'YouTube' }],
    },
    {
      id: '5', skill: 'Python', description: 'Python is a versatile programming language.',
      difficulty: 'beginner', estimatedHours: 35,
      officialDocs: 'https://docs.python.org/3/',
      freeCourses: [{ title: 'Python for Everybody', url: 'https://www.py4e.com/', platform: 'py4e' }],
      practicePlatforms: [{ name: 'HackerRank Python', url: 'https://www.hackerrank.com/domains/python' }],
      miniProjects: [{ title: 'Web Scraper', description: 'Build a web scraper with BeautifulSoup' }, { title: 'CLI Tool', description: 'Build a command-line to-do app' }],
      videoTutorials: [{ title: 'Python Full Course', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', platform: 'YouTube' }],
    },
    {
      id: '6', skill: 'SQL', description: 'SQL is used to manage and query relational databases.',
      difficulty: 'beginner', estimatedHours: 25,
      officialDocs: 'https://www.postgresql.org/docs/',
      freeCourses: [{ title: 'SQL Tutorial', url: 'https://www.sqltutorial.org/', platform: 'SQL Tutorial' }],
      practicePlatforms: [{ name: 'SQLZoo', url: 'https://sqlzoo.net/' }],
      miniProjects: [{ title: 'Library DB', description: 'Design a library database' }, { title: 'E-commerce DB', description: 'Build a product database with joins' }],
      videoTutorials: [{ title: 'SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', platform: 'YouTube' }],
    },
    {
      id: '7', skill: 'Docker', description: 'Docker is a containerization platform.',
      difficulty: 'intermediate', estimatedHours: 20,
      officialDocs: 'https://docs.docker.com/',
      freeCourses: [{ title: 'Docker 101', url: 'https://www.docker.com/101-tutorial/', platform: 'Docker' }],
      practicePlatforms: [{ name: 'Play with Docker', url: 'https://labs.play-with-docker.com/' }],
      miniProjects: [{ title: 'Dockerize App', description: 'Containerize a Node.js app' }],
      videoTutorials: [{ title: 'Docker Tutorial', url: 'https://www.youtube.com/watch?v=3c8BnqzD7Mg', platform: 'YouTube' }],
    },
    {
      id: '8', skill: 'Git', description: 'Git is a version control system.',
      difficulty: 'beginner', estimatedHours: 15,
      officialDocs: 'https://git-scm.com/doc',
      freeCourses: [{ title: 'Git Tutorial', url: 'https://www.atlassian.com/git/tutorials', platform: 'Atlassian' }],
      practicePlatforms: [{ name: 'Learn Git Branching', url: 'https://learngitbranching.js.org/' }],
      miniProjects: [{ title: 'Git Workflow', description: 'Practice branching and merging' }],
      videoTutorials: [{ title: 'Git & GitHub Crash Course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', platform: 'YouTube' }],
    },
    {
      id: '9', skill: 'REST APIs', description: 'REST APIs are web API design patterns.',
      difficulty: 'intermediate', estimatedHours: 20,
      officialDocs: 'https://restfulapi.net/',
      freeCourses: [{ title: 'REST API Tutorial', url: 'https://www.restapitutorial.com/', platform: 'REST API Tutorial' }],
      practicePlatforms: [{ name: 'Postman', url: 'https://www.postman.com/' }],
      miniProjects: [{ title: 'Books API', description: 'Build a CRUD REST API for books' }],
      videoTutorials: [{ title: 'REST API Concepts', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk', platform: 'YouTube' }],
    },
    {
      id: '10', skill: 'AWS', description: 'Amazon Web Services cloud platform.',
      difficulty: 'advanced', estimatedHours: 60,
      officialDocs: 'https://docs.aws.amazon.com/',
      freeCourses: [{ title: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/learn', platform: 'AWS' }],
      practicePlatforms: [{ name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' }],
      miniProjects: [{ title: 'Serverless App', description: 'Deploy a serverless function with Lambda' }],
      videoTutorials: [{ title: 'AWS Full Course', url: 'https://www.youtube.com/watch?v=3hLmDSczYE0', platform: 'YouTube' }],
    },
    {
      id: '11', skill: 'Data Structures', description: 'Data structures organize and store data efficiently.',
      difficulty: 'intermediate', estimatedHours: 40,
      officialDocs: 'https://www.geeksforgeeks.org/data-structures/',
      freeCourses: [{ title: 'DSA Course', url: 'https://www.geeksforgeeks.org/data-structures/', platform: 'GeeksforGeeks' }],
      practicePlatforms: [{ name: 'LeetCode', url: 'https://leetcode.com/' }],
      miniProjects: [{ title: 'Pathfinder', description: 'Implement BFS/DFS for pathfinding' }],
      videoTutorials: [{ title: 'DSA Full Course', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', platform: 'YouTube' }],
    },
    {
      id: '12', skill: 'Algorithms', description: 'Algorithms are step-by-step problem-solving procedures.',
      difficulty: 'intermediate', estimatedHours: 45,
      officialDocs: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
      freeCourses: [{ title: 'Algorithms', url: 'https://www.coursera.org/learn/algorithms-part1', platform: 'Coursera' }],
      practicePlatforms: [{ name: 'LeetCode', url: 'https://leetcode.com/' }],
      miniProjects: [{ title: 'Sorting Visualizer', description: 'Build a sorting algorithm visualizer' }],
      videoTutorials: [{ title: 'Algorithms Course', url: 'https://www.youtube.com/watch?v=8hly31xKli0', platform: 'YouTube' }],
    },
    {
      id: '13', skill: 'MongoDB', description: 'MongoDB is a NoSQL document database.',
      difficulty: 'intermediate', estimatedHours: 20,
      officialDocs: 'https://www.mongodb.com/docs/',
      freeCourses: [{ title: 'MongoDB University', url: 'https://university.mongodb.com/', platform: 'MongoDB' }],
      practicePlatforms: [{ name: 'MongoDB Playground', url: 'https://www.mongodb.com/playground' }],
      miniProjects: [{ title: 'Blog API', description: 'Build a blog API with MongoDB and Express' }],
      videoTutorials: [{ title: 'MongoDB Tutorial', url: 'https://www.youtube.com/watch?v=ofme2o29ngU', platform: 'YouTube' }],
    },
    {
      id: '14', skill: 'PostgreSQL', description: 'PostgreSQL is an advanced relational database.',
      difficulty: 'intermediate', estimatedHours: 25,
      officialDocs: 'https://www.postgresql.org/docs/',
      freeCourses: [{ title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', platform: 'PostgreSQL Tutorial' }],
      practicePlatforms: [{ name: 'PG Exercises', url: 'https://pgexercises.com/' }],
      miniProjects: [{ title: 'Inventory System', description: 'Build an inventory management system' }],
      videoTutorials: [{ title: 'PostgreSQL Crash Course', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', platform: 'YouTube' }],
    },
    {
      id: '15', skill: 'CSS', description: 'CSS styles and layouts web pages.',
      difficulty: 'beginner', estimatedHours: 30,
      officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      freeCourses: [{ title: 'CSS Tutorial', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', platform: 'FreeCodeCamp' }],
      practicePlatforms: [{ name: 'CSS Battle', url: 'https://cssbattle.dev/' }],
      miniProjects: [{ title: 'Portfolio Site', description: 'Build a responsive portfolio site' }],
      videoTutorials: [{ title: 'CSS Full Course', url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', platform: 'YouTube' }],
    },
    {
      id: '16', skill: 'HTML', description: 'HTML is the standard markup language for web pages.',
      difficulty: 'beginner', estimatedHours: 15,
      officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      freeCourses: [{ title: 'HTML Tutorial', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', platform: 'FreeCodeCamp' }],
      practicePlatforms: [{ name: 'MDN HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' }],
      miniProjects: [{ title: 'Landing Page', description: 'Build a product landing page' }],
      videoTutorials: [{ title: 'HTML Full Course', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', platform: 'YouTube' }],
    },
    {
      id: '17', skill: 'Tailwind CSS', description: 'Tailwind is a utility-first CSS framework.',
      difficulty: 'beginner', estimatedHours: 20,
      officialDocs: 'https://tailwindcss.com/docs',
      freeCourses: [{ title: 'Tailwind Tutorial', url: 'https://tailwindcss.com/docs/installation', platform: 'Tailwind' }],
      practicePlatforms: [{ name: 'Tailwind Play', url: 'https://play.tailwindcss.com/' }],
      miniProjects: [{ title: 'Dashboard UI', description: 'Build a dashboard layout with Tailwind' }],
      videoTutorials: [{ title: 'Tailwind Crash Course', url: 'https://www.youtube.com/watch?v=UBOj6rqRUME', platform: 'YouTube' }],
    },
    {
      id: '18', skill: 'Next.js', description: 'Next.js is a React framework for production apps.',
      difficulty: 'intermediate', estimatedHours: 40,
      officialDocs: 'https://nextjs.org/docs',
      freeCourses: [{ title: 'Next.js Tutorial', url: 'https://nextjs.org/learn', platform: 'Next.js' }],
      practicePlatforms: [{ name: 'Vercel', url: 'https://vercel.com/' }],
      miniProjects: [{ title: 'Blog Platform', description: 'Build a markdown blog with Next.js' }],
      videoTutorials: [{ title: 'Next.js Full Course', url: 'https://www.youtube.com/watch?v=KjY94sAKnWg', platform: 'YouTube' }],
    },
    {
      id: '19', skill: 'Express.js', description: 'Express is a web framework for Node.js.',
      difficulty: 'intermediate', estimatedHours: 25,
      officialDocs: 'https://expressjs.com/',
      freeCourses: [{ title: 'Express Tutorial', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs', platform: 'MDN' }],
      practicePlatforms: [{ name: 'Glitch', url: 'https://glitch.com/' }],
      miniProjects: [{ title: 'URL Shortener', description: 'Build a URL shortener service' }],
      videoTutorials: [{ title: 'Express Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', platform: 'YouTube' }],
    },
    {
      id: '20', skill: 'GraphQL', description: 'GraphQL is a query language for APIs.',
      difficulty: 'advanced', estimatedHours: 25,
      officialDocs: 'https://graphql.org/learn/',
      freeCourses: [{ title: 'GraphQL Tutorial', url: 'https://www.howtographql.com/', platform: 'HowToGraphQL' }],
      practicePlatforms: [{ name: 'GraphQL Playground', url: 'https://www.graphqlbin.com/' }],
      miniProjects: [{ title: 'GraphQL API', description: 'Build a GraphQL API for a library' }],
      videoTutorials: [{ title: 'GraphQL Crash Course', url: 'https://www.youtube.com/watch?v=ZQL7tL2S0oQ', platform: 'YouTube' }],
    },
    {
      id: '21', skill: 'Kubernetes', description: 'Kubernetes orchestrates containerized applications.',
      difficulty: 'advanced', estimatedHours: 40,
      officialDocs: 'https://kubernetes.io/docs/',
      freeCourses: [{ title: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', platform: 'Kubernetes' }],
      practicePlatforms: [{ name: 'Play with Kubernetes', url: 'https://labs.play-with-k8s.com/' }],
      miniProjects: [{ title: 'K8s Deployment', description: 'Deploy a microservice on Kubernetes' }],
      videoTutorials: [{ title: 'Kubernetes Tutorial', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', platform: 'YouTube' }],
    },
    {
      id: '22', skill: 'CI/CD', description: 'Continuous Integration and Continuous Deployment.',
      difficulty: 'intermediate', estimatedHours: 20,
      officialDocs: 'https://docs.github.com/en/actions',
      freeCourses: [{ title: 'GitHub Actions', url: 'https://docs.github.com/en/actions/learn-github-actions', platform: 'GitHub' }],
      practicePlatforms: [{ name: 'GitHub Actions', url: 'https://github.com/features/actions' }],
      miniProjects: [{ title: 'CI Pipeline', description: 'Set up a CI pipeline for a Node.js app' }],
      videoTutorials: [{ title: 'CI/CD Explained', url: 'https://www.youtube.com/watch?v=scEDHsr3YYg', platform: 'YouTube' }],
    },
    {
      id: '23', skill: 'Machine Learning', description: 'Machine Learning enables systems to learn from data.',
      difficulty: 'advanced', estimatedHours: 60,
      officialDocs: 'https://scikit-learn.org/stable/',
      freeCourses: [{ title: 'ML Course', url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera' }],
      practicePlatforms: [{ name: 'Kaggle', url: 'https://www.kaggle.com/' }],
      miniProjects: [{ title: 'Predict Model', description: 'Build a house price prediction model' }],
      videoTutorials: [{ title: 'ML Full Course', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', platform: 'YouTube' }],
    },
    {
      id: '24', skill: 'Data Science', description: 'Data Science extracts insights from data.',
      difficulty: 'intermediate', estimatedHours: 50,
      officialDocs: 'https://pandas.pydata.org/docs/',
      freeCourses: [{ title: 'Data Science', url: 'https://www.kaggle.com/learn', platform: 'Kaggle' }],
      practicePlatforms: [{ name: 'Kaggle', url: 'https://www.kaggle.com/' }],
      miniProjects: [{ title: 'EDA Project', description: 'Perform exploratory data analysis on a dataset' }],
      videoTutorials: [{ title: 'Data Science Full Course', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', platform: 'YouTube' }],
    },
    {
      id: '25', skill: 'Redis', description: 'Redis is an in-memory data structure store.',
      difficulty: 'intermediate', estimatedHours: 15,
      officialDocs: 'https://redis.io/docs/',
      freeCourses: [{ title: 'Redis Tutorial', url: 'https://redis.io/learn/', platform: 'Redis' }],
      practicePlatforms: [{ name: 'Redis Playground', url: 'https://try.redis.io/' }],
      miniProjects: [{ title: 'Caching Layer', description: 'Add Redis caching to a Node.js app' }],
      videoTutorials: [{ title: 'Redis Crash Course', url: 'https://www.youtube.com/watch?v=OqCK0ASnavw', platform: 'YouTube' }],
    },
    {
      id: '26', skill: 'Nginx', description: 'Nginx is a web server and reverse proxy.',
      difficulty: 'intermediate', estimatedHours: 15,
      officialDocs: 'https://nginx.org/en/docs/',
      freeCourses: [{ title: 'Nginx Tutorial', url: 'https://www.nginx.com/resources/wiki/', platform: 'Nginx' }],
      practicePlatforms: [],
      miniProjects: [{ title: 'Reverse Proxy', description: 'Set up Nginx as a reverse proxy for Node.js' }],
      videoTutorials: [{ title: 'Nginx Crash Course', url: 'https://www.youtube.com/watch?v=9t9Mp0BGnyI', platform: 'YouTube' }],
    },
  ];

  db.learningResources.seed(resources);

  const certs = [
    { id: 'c1', name: 'Google IT Support', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-it-support', free: true, skills: ['IT Support', 'Networking', 'Security'], difficulty: 'beginner', estimatedHours: 120 },
    { id: 'c2', name: 'AWS Cloud Practitioner', provider: 'AWS', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/', free: false, skills: ['AWS', 'Cloud'], difficulty: 'beginner', estimatedHours: 40 },
    { id: 'c3', name: 'Meta Front-End Developer', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', free: true, skills: ['React', 'HTML', 'CSS', 'JavaScript'], difficulty: 'beginner', estimatedHours: 140 },
    { id: 'c4', name: 'Google Data Analytics', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', free: true, skills: ['SQL', 'Python', 'Data Analysis'], difficulty: 'beginner', estimatedHours: 180 },
    { id: 'c5', name: 'IBM Data Science', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', free: true, skills: ['Python', 'Data Science', 'Machine Learning'], difficulty: 'intermediate', estimatedHours: 200 },
    { id: 'c6', name: 'Meta Back-End Developer', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer', free: true, skills: ['Node.js', 'Python', 'Django', 'Databases'], difficulty: 'intermediate', estimatedHours: 140 },
    { id: 'c7', name: 'Google Project Management', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-project-management', free: true, skills: ['Project Management', 'Agile'], difficulty: 'beginner', estimatedHours: 160 },
    { id: 'c8', name: 'Microsoft Azure Fundamentals', provider: 'Microsoft', url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals/', free: true, skills: ['Azure', 'Cloud'], difficulty: 'beginner', estimatedHours: 30 },
    { id: 'c9', name: 'FreeCodeCamp JavaScript', provider: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', free: true, skills: ['JavaScript', 'DSA'], difficulty: 'beginner', estimatedHours: 300 },
    { id: 'c10', name: 'Docker Essentials', provider: 'IBM', url: 'https://www.coursera.org/learn/docker-essentials', free: true, skills: ['Docker'], difficulty: 'beginner', estimatedHours: 15 },
    { id: 'c11', name: 'Kubernetes Fundamentals', provider: 'Coursera', url: 'https://www.coursera.org/learn/kubernetes', free: true, skills: ['Kubernetes', 'Docker'], difficulty: 'intermediate', estimatedHours: 30 },
    { id: 'c12', name: 'Machine Learning Specialization', provider: 'Coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction', free: true, skills: ['Machine Learning', 'Python'], difficulty: 'advanced', estimatedHours: 200 },
  ];

  db.certificates.seed(certs);

  const questions = [
    { id: 'q1', type: 'hr', difficulty: 'beginner', question: 'Tell me about yourself.', answer: 'Start with your current role, then your most relevant experience, and end with why you are interested in this position.' },
    { id: 'q2', type: 'hr', difficulty: 'beginner', question: 'Why do you want to work here?', answer: 'Research the company, mention specific projects or values that resonate with you, and connect your skills to their needs.' },
    { id: 'q3', type: 'hr', difficulty: 'intermediate', question: 'What are your strengths and weaknesses?', answer: 'Pick a strength relevant to the role. For weaknesses, mention one you are actively improving with a concrete example.' },
    { id: 'q4', type: 'hr', difficulty: 'intermediate', question: 'Where do you see yourself in 5 years?', answer: 'Show ambition aligned with the company. Mention skills you want to develop and roles you aspire to.' },
    { id: 'q5', type: 'hr', difficulty: 'advanced', question: 'Tell me about a time you handled a conflict at work.', answer: 'Use the STAR method: Situation, Task, Action, Result.' },
    { id: 'q6', type: 'technical', difficulty: 'beginner', question: 'What is the difference between let, const, and var in JavaScript?', answer: 'var is function-scoped, let and const are block-scoped. const cannot be reassigned.' },
    { id: 'q7', type: 'technical', difficulty: 'beginner', question: 'What is the DOM?', answer: 'The Document Object Model (DOM) is a programming interface for HTML documents.' },
    { id: 'q8', type: 'technical', difficulty: 'intermediate', question: 'Explain the concept of closures in JavaScript.', answer: 'A closure is a function that retains access to its outer scope even after the outer function has returned.' },
    { id: 'q9', type: 'technical', difficulty: 'intermediate', question: 'What is RESTful API design?', answer: 'REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URLs.' },
    { id: 'q10', type: 'technical', difficulty: 'advanced', question: 'How does the Event Loop work in Node.js?', answer: 'Node.js uses a single-threaded event loop to handle async operations by offloading them to the system kernel when possible.' },
    { id: 'q11', type: 'technical', difficulty: 'intermediate', question: 'What is the difference between SQL and NoSQL databases?', answer: 'SQL databases are relational with fixed schemas; NoSQL databases are non-relational with flexible schemas.' },
    { id: 'q12', type: 'technical', difficulty: 'advanced', question: 'Explain how Docker containers work.', answer: 'Docker containers package an application with its dependencies into a lightweight, portable unit that runs consistently across environments.' },
    { id: 'q13', type: 'coding', difficulty: 'beginner', question: 'Write a function to reverse a string.', answer: 'function reverseString(str) { return str.split("").reverse().join(""); }' },
    { id: 'q14', type: 'coding', difficulty: 'intermediate', question: 'Write a function to check if a string is a palindrome.', answer: 'function isPalindrome(str) { const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ""); return cleaned === cleaned.split("").reverse().join(""); }' },
    { id: 'q15', type: 'coding', difficulty: 'intermediate', question: 'Find the two numbers in an array that sum to a target.', answer: 'Use a hash map to store complements: for each num, check if target - num exists in the map.' },
    { id: 'q16', type: 'coding', difficulty: 'advanced', question: 'Implement a binary search algorithm.', answer: 'function binarySearch(arr, target) { let l=0, r=arr.length-1; while(l<=r) { const mid = Math.floor((l+r)/2); if(arr[mid]===target) return mid; if(arr[mid]<target) l=mid+1; else r=mid-1; } return -1; }' },
    { id: 'q17', type: 'scenario', difficulty: 'beginner', question: 'You receive a bug report on Friday at 4:55 PM. What do you do?', answer: 'Assess severity. If critical, fix it immediately. If minor, triage it for next week.' },
    { id: 'q18', type: 'scenario', difficulty: 'intermediate', question: 'Your team misses a sprint deadline. How do you handle it?', answer: 'Analyze the root cause, adjust future estimates, and communicate transparently with stakeholders.' },
    { id: 'q19', type: 'scenario', difficulty: 'advanced', question: 'A production system goes down. Walk through your response.', answer: '1) Identify and mitigate immediate impact. 2) Investigate root cause. 3) Apply fix. 4) Document incident. 5) Implement preventative measures.' },
    { id: 'q20', type: 'behavioral', difficulty: 'beginner', question: 'Describe a project you are proud of.', answer: 'Use STAR method. Focus on your contribution and the impact.' },
    { id: 'q21', type: 'behavioral', difficulty: 'intermediate', question: 'Tell me about a time you failed.', answer: 'Be honest. Focus on what you learned and how you improved.' },
    { id: 'q22', type: 'behavioral', difficulty: 'advanced', question: 'Describe a time you had to learn a new technology quickly.', answer: 'Explain your learning process, resources used, and how you applied the new technology successfully.' },
    { id: 'q23', type: 'technical', difficulty: 'beginner', question: 'What is Git and why is it used?', answer: 'Git is a distributed version control system used to track changes in source code during software development.' },
    { id: 'q24', type: 'technical', difficulty: 'intermediate', question: 'What is the difference between TCP and UDP?', answer: 'TCP is connection-oriented with guaranteed delivery; UDP is connectionless with no delivery guarantee but lower latency.' },
    { id: 'q25', type: 'technical', difficulty: 'advanced', question: 'What is eventual consistency in distributed systems?', answer: 'Eventual consistency guarantees that if no new updates are made to a data item, all accesses will return the last updated value eventually.' },
  ];

  db.interviewQuestions.seed(questions);

  // Seed 20+ sample job descriptions
  const sampleJobs = [
    {
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      rawText: `Job Title: Frontend Developer
Company: TechCorp Inc.
Location: San Francisco, CA

We are looking for a Frontend Developer to join our team.

Responsibilities:
- Build responsive web applications using React
- Implement UI components with TypeScript and Tailwind CSS
- Collaborate with backend teams on REST API integration
- Write unit tests and ensure code quality
- Optimize applications for maximum performance

Qualifications:
- 3+ years of experience with React
- Strong knowledge of TypeScript, HTML, CSS
- Experience with Next.js is a plus
- Familiarity with Git version control
- Understanding of responsive design principles
- Excellent problem-solving skills
- Strong communication and teamwork abilities

Required Skills: React, TypeScript, JavaScript, HTML, CSS, Git, REST APIs, Tailwind CSS
Preferred Skills: Next.js, GraphQL, Docker, CI/CD, Testing`,
    },
    {
      title: 'Backend Developer',
      company: 'DataFlow Systems',
      rawText: `Job Title: Backend Developer
Company: DataFlow Systems
Location: New York, NY

We need a skilled Backend Developer to build scalable services.

Responsibilities:
- Design and develop RESTful APIs using Node.js and Express.js
- Create and optimize SQL and MongoDB database schemas
- Implement authentication and authorization
- Write clean, maintainable, and well-documented code
- Participate in code reviews and architectural discussions

Qualifications:
- 4+ years of backend development experience
- Proficiency in Node.js and Express.js
- Strong SQL skills with PostgreSQL or MySQL
- Experience with MongoDB
- Knowledge of Docker and cloud services
- Understanding of CI/CD pipelines
- Leadership and mentoring skills

Required Skills: Node.js, Express.js, SQL, PostgreSQL, MongoDB, Docker, REST APIs
Preferred Skills: AWS, Kubernetes, Redis, GraphQL, TypeScript`,
    },
    {
      title: 'Full Stack Developer',
      company: 'Webify Studio',
      rawText: `Job Title: Full Stack Developer
Company: Webify Studio
Location: Austin, TX

Join our dynamic team building modern web applications.

Responsibilities:
- Develop frontend features with React and Next.js
- Build and maintain backend services with Node.js
- Design database schemas and write complex queries
- Deploy and monitor applications on cloud platforms
- Collaborate with designers to implement pixel-perfect UIs

Qualifications:
- 3+ years of full stack development experience
- Strong proficiency in React, Node.js, TypeScript
- Experience with SQL and NoSQL databases
- Familiarity with AWS or similar cloud providers
- Knowledge of Docker and containerization
- Time management and adaptability

Required Skills: React, Node.js, TypeScript, JavaScript, SQL, PostgreSQL, MongoDB, Docker, AWS, REST APIs
Preferred Skills: Next.js, Tailwind CSS, GraphQL, Kubernetes, CI/CD`,
    },
    {
      title: 'Data Scientist',
      company: 'Insight Analytics',
      rawText: `Job Title: Data Scientist
Company: Insight Analytics
Location: Seattle, WA

We are seeking a Data Scientist to extract insights from complex datasets.

Responsibilities:
- Analyze large datasets using Python and SQL
- Build and deploy machine learning models
- Create data visualizations and dashboards
- Present findings to stakeholders
- Design experiments and A/B tests

Qualifications:
- 2+ years of data science experience
- Proficiency in Python, Pandas, NumPy
- Strong SQL skills
- Experience with machine learning frameworks
- Knowledge of data visualization tools
- Critical thinking and creativity

Required Skills: Python, SQL, Machine Learning, Data Science, Pandas, NumPy
Preferred Skills: TensorFlow, PyTorch, Tableau, AWS, Deep Learning`,
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudScale Solutions',
      rawText: `Job Title: DevOps Engineer
Company: CloudScale Solutions
Location: Chicago, IL

We are looking for a DevOps Engineer to streamline our infrastructure.

Responsibilities:
- Manage CI/CD pipelines using GitHub Actions and Jenkins
- Containerize applications with Docker and orchestrate with Kubernetes
- Monitor system performance and troubleshoot issues
- Implement infrastructure as code using Terraform
- Ensure system security and compliance

Qualifications:
- 3+ years of DevOps experience
- Strong knowledge of Docker and Kubernetes
- Experience with cloud platforms (AWS preferred)
- Familiarity with CI/CD tools
- Proficiency in Linux administration
- Problem solving and teamwork

Required Skills: Docker, Kubernetes, AWS, CI/CD, Jenkins, Terraform, Linux, Git
Preferred Skills: Python, Ansible, Prometheus, Grafana, Helm`,
    },
    {
      title: 'Mobile Developer (React Native)',
      company: 'AppForge',
      rawText: `Job Title: React Native Developer
Company: AppForge
Location: Remote

Build cross-platform mobile applications for millions of users.

Responsibilities:
- Develop and maintain React Native applications
- Implement pixel-perfect UIs for iOS and Android
- Integrate with REST and GraphQL APIs
- Optimize app performance and fix bugs
- Collaborate with product and design teams

Qualifications:
- 2+ years of React Native experience
- Strong JavaScript/TypeScript skills
- Understanding of mobile UI/UX principles
- Experience with REST APIs
- Knowledge of Git and CI/CD
- Creativity and attention to detail

Required Skills: React Native, JavaScript, TypeScript, REST APIs, Git
Preferred Skills: iOS Development, Android Development, GraphQL, Firebase, Expo`,
    },
    {
      title: 'Cloud Architect',
      company: 'Enterprise Cloud Inc.',
      rawText: `Job Title: Cloud Architect
Company: Enterprise Cloud Inc.
Location: Boston, MA

Design and implement cloud-native architectures.

Responsibilities:
- Design scalable cloud infrastructure on AWS
- Implement security best practices and compliance
- Optimize cloud costs and resource utilization
- Lead migration of on-premises systems to cloud
- Mentor engineering team on cloud best practices

Qualifications:
- 5+ years of cloud architecture experience
- Deep expertise in AWS services
- Knowledge of Azure or GCP is a plus
- Experience with Terraform and Infrastructure as Code
- Understanding of networking and security
- Leadership and communication skills

Required Skills: AWS, Azure, GCP, Terraform, Docker, Kubernetes, Linux, Networking
Preferred Skills: Python, Go, CI/CD, Security, Cost Optimization`,
    },
    {
      title: 'Machine Learning Engineer',
      company: 'AI Innovations Lab',
      rawText: `Job Title: Machine Learning Engineer
Company: AI Innovations Lab
Location: San Jose, CA

Build production ML systems at scale.

Responsibilities:
- Design and implement ML pipelines
- Train and deploy machine learning models
- Build data processing systems
- Monitor model performance in production
- Research and implement new ML techniques

Qualifications:
- 3+ years of ML engineering experience
- Strong Python programming skills
- Experience with TensorFlow or PyTorch
- Knowledge of SQL and data processing
- Understanding of MLOps practices
- Problem solving and adaptability

Required Skills: Python, Machine Learning, TensorFlow, PyTorch, SQL, Docker, AWS
Preferred Skills: NLP, Computer Vision, Kubernetes, Kubeflow, Spark`,
    },
    {
      title: 'Cybersecurity Analyst',
      company: 'SecureNet Defense',
      rawText: `Job Title: Cybersecurity Analyst
Company: SecureNet Defense
Location: Washington, DC

Protect our infrastructure from cyber threats.

Responsibilities:
- Monitor security events and investigate incidents
- Conduct vulnerability assessments and penetration testing
- Implement security policies and procedures
- Manage firewalls and intrusion detection systems
- Perform security audits and compliance checks

Qualifications:
- 3+ years of cybersecurity experience
- Knowledge of network security protocols
- Experience with security tools (SIEM, IDS/IPS)
- Understanding of OWASP Top 10 vulnerabilities
- Certifications (CISSP, CEH, Security+) preferred
- Critical thinking and attention to detail

Required Skills: Linux, Networking, Security, Python
Preferred Skills: AWS Security, Azure Security, Kubernetes Security, Terraform`,
    },
    {
      title: 'Product Manager',
      company: 'GrowthStage Products',
      rawText: `Job Title: Product Manager
Company: GrowthStage Products
Location: Denver, CO

Drive product strategy and execution.

Responsibilities:
- Define product vision, strategy, and roadmap
- Gather and prioritize product requirements
- Work closely with engineering, design, and marketing
- Analyze market trends and competitive landscape
- Measure product performance and iterate

Qualifications:
- 3+ years of product management experience
- Understanding of Agile and Scrum methodologies
- Excellent communication and leadership skills
- Data-driven decision making ability
- Technical background preferred
- Teamwork and collaboration

Required Skills: Agile, Scrum, Jira, Communication, Leadership, Problem Solving
Preferred Skills: SQL, Data Analysis, User Research, Figma, A/B Testing`,
    },
    {
      title: 'Data Engineer',
      company: 'BigData Corp',
      rawText: `Job Title: Data Engineer
Company: BigData Corp
Location: Atlanta, GA

Build and maintain data infrastructure at scale.

Responsibilities:
- Design and build data pipelines using Python and SQL
- Manage data warehouses and data lakes
- Implement ETL processes
- Optimize data storage and retrieval
- Ensure data quality and reliability

Qualifications:
- 3+ years of data engineering experience
- Strong Python and SQL skills
- Experience with Apache Spark or similar
- Knowledge of cloud data services
- Understanding of data modeling
- Problem solving and teamwork

Required Skills: Python, SQL, Apache Spark, AWS, Docker, Data Modeling, ETL
Preferred Skills: Airflow, Kafka, Snowflake, dbt, Kubernetes`,
    },
    {
      title: 'QA Engineer',
      company: 'QualityFirst Tech',
      rawText: `Job Title: QA Engineer
Company: QualityFirst Tech
Location: Remote

Ensure software quality through comprehensive testing.

Responsibilities:
- Write and execute test plans and test cases
- Automate testing processes using Selenium and Cypress
- Perform manual and automated regression testing
- Report bugs and track issues in Jira
- Collaborate with developers to improve code quality

Qualifications:
- 2+ years of QA engineering experience
- Experience with automated testing tools
- Knowledge of testing methodologies
- Understanding of CI/CD pipelines
- Attention to detail and communication
- Critical thinking and creativity

Required Skills: Selenium, Cypress, JavaScript, Git, CI/CD, Jira, Agile
Preferred Skills: Python, Docker, Performance Testing, Security Testing`,
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignCraft Studio',
      rawText: `Job Title: UI/UX Designer
Company: DesignCraft Studio
Location: Los Angeles, CA

Create beautiful and intuitive user experiences.

Responsibilities:
- Design user interfaces for web and mobile applications
- Conduct user research and usability testing
- Create wireframes, prototypes, and mockups
- Collaborate with developers on implementation
- Maintain and evolve design systems

Qualifications:
- 2+ years of UI/UX design experience
- Proficiency in Figma or Sketch
- Understanding of design principles and typography
- Knowledge of HTML and CSS is a plus
- Excellent visual design skills
- Creativity and communication

Required Skills: Figma, HTML, CSS, JavaScript, User Research, Prototyping
Preferred Skills: React, Tailwind CSS, Motion Design, Accessibility`,
    },
    {
      title: 'Technical Writer',
      company: 'DocuPerfect',
      rawText: `Job Title: Technical Writer
Company: DocuPerfect
Location: Remote

Create clear and comprehensive technical documentation.

Responsibilities:
- Write and maintain API documentation
- Create user guides and tutorials
- Document system architectures and workflows
- Collaborate with engineers and product managers
- Ensure documentation accuracy and clarity

Qualifications:
- 2+ years of technical writing experience
- Excellent written communication skills
- Ability to understand complex technical concepts
- Experience with documentation tools
- Knowledge of Markdown and Git
- Attention to detail and organization

Required Skills: Communication, Writing, Git, Markdown, Documentation
Preferred Skills: JavaScript, Python, REST APIs, HTML, CSS`,
    },
    {
      title: 'Site Reliability Engineer',
      company: 'ReliableOps',
      rawText: `Job Title: Site Reliability Engineer
Company: ReliableOps
Location: Seattle, WA

Ensure reliability and performance of production systems.

Responsibilities:
- Monitor system health and respond to incidents
- Automate operational tasks and improve efficiency
- Perform root cause analysis for production issues
- Implement SLOs, SLIs, and error budgets
- Capacity planning and performance tuning

Qualifications:
- 4+ years of SRE or DevOps experience
- Strong Linux systems administration
- Experience with monitoring tools (Prometheus, Grafana)
- Knowledge of distributed systems
- Programming skills in Python or Go
- Problem solving and calm under pressure

Required Skills: Linux, Docker, Kubernetes, AWS, Prometheus, Grafana, Python
Preferred Skills: Go, Terraform, CI/CD, Elasticsearch, Kafka`,
    },
    {
      title: 'Blockchain Developer',
      company: 'ChainLink Labs',
      rawText: `Job Title: Blockchain Developer
Company: ChainLink Labs
Location: Remote

Build decentralized applications on blockchain platforms.

Responsibilities:
- Develop and deploy smart contracts using Solidity
- Build dApps with Web3.js and React
- Design tokenomics and blockchain architectures
- Conduct security audits of smart contracts
- Stay current with blockchain innovations

Qualifications:
- 2+ years of blockchain development
- Strong Solidity programming skills
- Experience with Ethereum and other L1/L2 chains
- Understanding of Web3 technologies
- Knowledge of cryptography fundamentals
- Adaptability and continuous learning

Required Skills: Solidity, JavaScript, React, Web3, Ethereum, Smart Contracts
Preferred Skills: TypeScript, Rust, Go, IPFS, DeFi, NFTs`,
    },
    {
      title: 'Systems Administrator',
      company: 'InfraCore Services',
      rawText: `Job Title: Systems Administrator
Company: InfraCore Services
Location: Dallas, TX

Manage and maintain critical IT infrastructure.

Responsibilities:
- Install, configure, and maintain server systems
- Manage network infrastructure and security
- Perform system backups and disaster recovery
- Troubleshoot hardware and software issues
- Maintain documentation and compliance

Qualifications:
- 3+ years of systems administration experience
- Proficiency in Linux and Windows Server
- Knowledge of networking concepts
- Experience with virtualization (VMware, Hyper-V)
- Scripting skills (Bash, PowerShell)
- Time management and teamwork

Required Skills: Linux, Windows Server, Networking, Bash, Docker, Git
Preferred Skills: AWS, Azure, Ansible, Terraform, Kubernetes`,
    },
    {
      title: 'AI Research Scientist',
      company: 'DeepMind Labs',
      rawText: `Job Title: AI Research Scientist
Company: DeepMind Labs
Location: Cambridge, MA

Push the boundaries of artificial intelligence research.

Responsibilities:
- Conduct cutting-edge AI research
- Design and implement novel neural architectures
- Publish research papers in top conferences
- Collaborate with research teams globally
- Mentor junior researchers

Qualifications:
- PhD in Computer Science, AI, or related field
- Strong publication record in ML/AI conferences
- Deep understanding of deep learning theory
- Proficiency in Python and PyTorch/TensorFlow
- Experience with large-scale model training
- Creativity and scientific rigor

Required Skills: Python, Machine Learning, Deep Learning, TensorFlow, PyTorch, Algorithms
Preferred Skills: NLP, Computer Vision, Reinforcement Learning, Distributed Systems`,
    },
    {
      title: 'Solutions Architect',
      company: 'Enterprise Solutions Group',
      rawText: `Job Title: Solutions Architect
Company: Enterprise Solutions Group
Location: New York, NY

Design end-to-end technical solutions for enterprise clients.

Responsibilities:
- Understand client requirements and design solutions
- Create technical architecture documentation
- Lead technical presentations and demonstrations
- Guide development teams during implementation
- Evaluate and recommend technologies

Qualifications:
- 5+ years of software architecture experience
- Deep knowledge of full-stack technologies
- Experience with cloud architectures
- Excellent presentation and communication skills
- Previous consulting experience preferred
- Leadership and negotiation skills

Required Skills: AWS, React, Node.js, SQL, Docker, REST APIs, Communication
Preferred Skills: Kubernetes, Microservices, Event-Driven Architecture, Enterprise Integration`,
    },
    {
      title: 'Database Administrator',
      company: 'DataTrust Corp',
      rawText: `Job Title: Database Administrator
Company: DataTrust Corp
Location: Phoenix, AZ

Manage and optimize database systems across the organization.

Responsibilities:
- Install, configure, and maintain database servers
- Perform database tuning and optimization
- Implement backup and recovery strategies
- Manage user access and security
- Monitor database performance and availability

Qualifications:
- 4+ years of DBA experience
- Expertise in PostgreSQL and MySQL
- Knowledge of MongoDB and Redis
- Understanding of high-availability configurations
- Scripting skills (Python, Bash)
- Problem solving and attention to detail

Required Skills: SQL, PostgreSQL, MySQL, MongoDB, Redis, Linux, Bash
Preferred Skills: AWS RDS, Azure SQL, Cassandra, Elasticsearch, Terraform`,
    },
  ];

  const existingJobs = db.jobs.findAll();
  if (existingJobs.length === 0) {
    sampleJobs.forEach(job => {
      const { parseJobDescription } = require('./ai');
      const parsedData = parseJobDescription(job.rawText);
      db.jobs.create({
        id: uuidv4(),
        userId: 'seed',
        title: job.title,
        company: job.company,
        rawText: job.rawText,
        parsedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    console.log(`Seeded ${sampleJobs.length} sample job descriptions.`);
  }

  console.log('Database seeded with learning resources, certificates, interview questions, and sample jobs.');
}
