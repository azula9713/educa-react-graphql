// https://docs.cypress.io/api/introduction/api.html

describe("Visit Signin Page Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h4", "Educa Education Center");
  });
});


