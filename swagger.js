import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '0.2.2',
    title: '範例應用API',
    description: '範例應用功能API'
  },
  host: 'localhost:3000',
  basePath: '/api/',
  definitions: {
    todoCreateData: {
      $title: '待辦事項',
      memo: '待辦備註'
    },
    todoData: {
      "_id": "65c5e78e1773050c199ac11c",
      "title": "待辦事項",
      "memo": "待辦備註",
      "done": false,
      "isDelete": false,
      "createdAt": "2024-02-09T08:51:26.444Z",
      "updatedAt": "2024-02-27T11:25:14.797Z"
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./routers/routers.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);