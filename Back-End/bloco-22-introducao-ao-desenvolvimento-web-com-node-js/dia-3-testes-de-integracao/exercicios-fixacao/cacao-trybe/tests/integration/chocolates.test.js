const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

const { expect } = chai;

chai.use(chaiHttp);

const mockFile = JSON.stringify({
  brands: [
    {
      id: 1,
      name: 'Lindt & Sprungli',
    },
    {
      id: 2,
      name: 'Ferrero',
    },
    {
      id: 3,
      name: 'Ghirardelli',
    },
  ],
  chocolates: [
    {
      id: 1,
      name: 'Mint Intense',
      brandId: 1,
    },
    {
      id: 2,
      name: 'White Coconut',
      brandId: 1,
    },
    {
      id: 3,
      name: 'Mon Chéri',
      brandId: 2,
    },
    {
      id: 4,
      name: 'Mounds',
      brandId: 3,
    },
  ]
});

describe('Testando a API Cacao Trybe', function () {
  beforeEach(function () {
    sinon.stub(fs.promises, 'readFile')
      .resolves(mockFile);
    sinon.stub(fs.promises, 'writeFile');
  });

  afterEach(function () {
    sinon.restore();
  });
  describe('Usando o método GET em /chocolates', function () {
    it('Retorna a lista completa de chocolates!', async function () {
      const output = [
        { id: 1, name: 'Mint Intense', brandId: 1 },
        { id: 2, name: 'White Coconut', brandId: 1 },
        { id: 3, name: 'Mon Chéri', brandId: 2 },
        { id: 4, name: 'Mounds', brandId: 3 },
      ];

      const response = await chai
        .request(app)
        .get('/chocolates');
      expect(response.status).to.be.equal(200);
      expect(response.body.chocolates).to.deep.equal(output);
    });
  });
  describe('Usando o método GET em /chocolates/:id para buscar o ID 4', function () {
    it('Retorna o chocolate Mounds', async function () {
      const response = await chai
        .request(app)
        .get('/chocolates/4');

      expect(response.status).to.be.equal(200);
      expect(response.body.chocolate).to.deep.equal([
        {
          id: 4,
          name: 'Mounds',
          brandId: 3,
        }]);
    });
  });
  describe('Usando o método GET em /chocolates/brand/:brandId para buscar brandId 1', function () {
    it('Retorna os chocolates da marca Lindt & Sprungli', async function () {
      const response = await chai
        .request(app)
        .get('/chocolates/brand/1');

      expect(response.status).to.be.equal(200);
      expect(response.body.chocolates).to.deep.equal([
        {
          id: 1,
          name: 'Mint Intense',
          brandId: 1,
        },
        {
          id: 2,
          name: 'White Coconut',
          brandId: 1,
        },
      ]);
    });
  });
  describe('Usando o metodo GET em /chocolates/total', function () {
    it('Retorna o total de chocolates cadastrados', async function () {
      const response = await chai.request(app).get('/chocolates/total');
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ totalChocolates: 4 });
    });
  });
  describe('Usando o metodo GET em /chocolates/search', function () {
    it('Retorna os chocolates que contem a string passada', async function () {
      const response = await chai.request(app).get('/chocolates/search?name=White');
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ chocolates: [{
        id: 2,
        name: "White Coconut",
        brandId: 1
      }]
       });
    });
    it('Retorna array vazio e 404 caso não encontre nenhum chocolate', async function () {
      const response = await chai.request(app).get('/chocolates/search?name=ZZZ');
      console.log(response.body);
      
      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal([]);
    });
  });
  describe('Usando o metodo PUT em /chocolates/:id', function () {
    it('Atualiza um choc que exista', async function () {
      const request = { 
        name: "Mint Pretty Good",
        brandId: 2
      }
      const returnObj = {
        chocolate: { 
          id: 1,
          name: "Mint Pretty Good",
          brandId: 2
        }
      }
      const response = await chai
        .request(app)
        .put('/chocolates/1')
        .send(request);
      
      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(returnObj);
    });
    it('Se i choc não existe, retorna um erro', async function () {
      const request = { 
        name: "Mint Pretty Good",
        brandId: 2
      }
      const response = await chai
        .request(app)
        .put('/chocolates/555')
        .send(request);
      
      expect(response.status).to.be.equal(404);
      expect(response.body).to.deep.equal({ message: 'chocolate not found' });
    });
  });
});