const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });

  it("when a new todo is created, it should appear on the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "820e6dd8-094f-43d8-8346-ed35e7d9cdb9",
            date: "2023-10-14T22:53:22.629Z",
            content: "Test TODO",
            done: false,
          },
        },
      });
    }).as("createTodo");

    cy.visit(BASE_URL);
    cy.get("input[name='add-todo']").type("Test TODO");
    cy.get("[aria-label='Adicionar novo item']").click();
    cy.get("table > tbody").contains("Test TODO");
  });
});
