import { setCookie, deleteCookie } from '../../src/utils/cookie';
import { addFillings } from '../../src/services/slices/burgerSlice';
const URL = 'https://norma.nomoreparties.space/api';
//имитируем логин для получения токенов
describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.request('POST', `${URL}/auth/login`, {
      email: 'Andreykabtsr@gmail.com',
      password: 'Andreyka'
    }).then((response) => {
      const { accessToken, refreshToken } = response.body;

      // Устанавливаем accessToken в куки
      const token = accessToken;
      cy.setCookie('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    });

    cy.intercept('GET', `${URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('');
    cy.wait('@getIngredients', { timeout: 15000 });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Тест получения списка ингредиентов с сервера', () => {
    cy.get('[data-cy="burgerconstructor"]').as('constructor');

    cy.addFillings('Булки');
    cy.addFillings('Начинки');
    //проверка на наличие данных
    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Открытие и закрытие окна с информацией об ингредиенте', () => {
    // Клик по первому ингредиенту
    cy.get('[data-cy="ingredient-item"]').eq(0).click();

    // Проверка, что модальное окно появилось и содержит нужный текст
    cy.get('[data-cy="modal"]').as('ingredientModal');
    cy.get('@ingredientModal').should('be.visible');
    cy.get('@ingredientModal').contains('Краторная булка N-200i');

    // Закрытие модалки через кнопку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('@ingredientModal').should('not.exist');
  });

  it('Тест создания заказа', () => {
    cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' }).as(
      'orderBurgerApi'
    );
    cy.get('[data-cy="burgerconstructor"]').as('constructor');

    cy.addFillings('Булки');
    cy.addFillings('Начинки');
    // нажатие на кнопку оформления заказа
    cy.get('[data-cy="submit-order"]')
      .should('exist')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', '79069');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    cy.get('@constructor').should('not.contain', 'Говяжий метеорит (отбивная)');
    cy.get('@constructor').should('not.contain', 'Флюоресцентная булка R2-D3');

    cy.wait('@orderBurgerApi');
  });
});
