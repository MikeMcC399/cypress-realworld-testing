/* 
  Note: These tests rely upon local storage state from previous tests, 
  so make sure to run all of them at once, ie: don't use `it.only()`
*/
import learnJson from "../../learn.json"
const { _ } = Cypress
const sectionSlug = "cypress-fundamentals"
const lessons = learnJson[sectionSlug].lessons

describe("Next Lesson Button on Course Pages", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    // @ts-ignore
    cy.saveLocalStorage()
  })

  it("says 'Start Course' and links to the first lesson if none of the lessons have been completed", () => {
    cy.visit(`/${sectionSlug}`)
    cy.getBySel("next-lesson-button").then(($btn) => {
      // @ts-ignore
      const text = $btn.text()
      // @ts-ignore
      const href = $btn.attr("href")

      expect(text).to.eq("Start Course")
      expect(href).to.eq(
        `/${sectionSlug}/${learnJson[`${sectionSlug}`].lessons[0].slug}`
      )
    })
  })

  it("says 'Next Lesson' and links to the 2nd lesson if the first lesson has been completed", () => {
    cy.visit(`/${sectionSlug}/cypress-runs-in-the-browser`)
    cy.get("#answer-0").click()

    cy.visit(`/${sectionSlug}`)

    cy.getBySel("next-lesson-button").then(($btn) => {
      // @ts-ignore
      const text = $btn.text()
      // @ts-ignore
      const href = $btn.attr("href")

      expect(text).to.eq("Next Lesson")
      expect(href).to.eq(
        `/${sectionSlug}/${learnJson[`${sectionSlug}`].lessons[1].slug}`
      )
    })
  })

  it("says 'Course Completed' and links to the home page if all of the lessons have been completed", () => {
    cy.visit(`/${sectionSlug}/${learnJson[sectionSlug].lessons[0].slug}`)

    _.each(lessons, (lesson, index) => {
      cy.location("pathname").should(
        "eq",
        `/${sectionSlug}/${learnJson[sectionSlug].lessons[index].slug}`
      )
      cy.getBySel(
        `"challenge-answer-${lesson["challenges"][0]["correctAnswerIndex"]}"`
      ).click()
      cy.getBySel("lesson-complete-0").should("have.class", "bg-indigo-600")
      cy.getBySel("next-lesson-button").click()
    })

    cy.visit(`/${sectionSlug}`)

    cy.getBySel("next-lesson-button").then(($btn) => {
      // @ts-ignore
      const text = $btn.text()
      // @ts-ignore
      const href = $btn.attr("href")

      expect(text).to.eq("Course Completed")
      expect(href).to.eq("/")

      cy.wrap($btn).click()
    })

    cy.location("pathname").should("eq", "/")
  })
})

export {}
