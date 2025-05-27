import { setCookie, deleteCookie } from '../../src/utils/cookie';

const URL = "https://norma.nomoreparties.space/api";

describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    setCookie('accessToken', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzVkNzNjYzJmMzBjMDAxY2IyNzk3ZiIsImlhdCI6MTc0ODM2Njg2NiwiZXhwIjoxNzQ4MzY4MDY2fQ.LrZ0duSbwFyjYLJDrhoxCIYgBVo-TEO0QLHZoNyZWQg");
    localStorage.setItem("refreshToken", "266419c948a51bdf9bccabb1a20055f206ed2eb0acd7503ef239d1c5cbdcab366a41e8dd659c7137");
    cy.intercept('GET', `${URL}/auth/user`, {fixture: 'user.json'}).as('getUser');
    cy.intercept('GET', `${URL}/ingredients`, {fixture: 'ingredients.json'}).as('getIngredients');
    cy.visit('');
    cy.wait('@getUser');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});