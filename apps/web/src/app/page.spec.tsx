import Home from "./(root)/page";

describe("<Home />", () => {
  it("mounts", () => {
    cy.mount(<Home />);
  });
});
